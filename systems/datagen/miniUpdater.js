/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/prefer-object-from-entries */
const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const Sleep = require("hyarcade-utils/Sleep");
const HyarcadeWorkerRequest = require("hyarcade-requests/HyarcadeWorkerRequest");
const { readFile, writeFile } = require("fs-extra");
const fs = require("fs-extra");
const Database = require("hyarcade-requests/Database");

let cfg;
let masterDoc;

let disclist;

/**
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * @param target
 * @param source
 * @returns {object}
 */
function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    }
  }
  return output;
}

/**
 *
 */
function timeout() {
  return new Promise((resolve, reject) => {
    Sleep(30000)
      .then(() => {
        reject(new Error("Request timed out!"));
      })
      .catch(reject);
  });
}

/**
 *
 * @param {string[]} uuids
 * @returns {Promise<Response>}
 */
async function requestData(uuids) {
  const realUUIDs = uuids.filter(u => u != "");

  try {
    return await Promise.race([HyarcadeWorkerRequest(realUUIDs), timeout()]);
  } catch (error) {
    Logger.err(error);
    Logger.debug("Requesting data again!");
    return requestData(realUUIDs);
  }
}

/**
 *
 * @param {*} uuidArr
 * @param {*} currentBatch
 * @param {*} segmentedAccs
 * @returns {*}
 */
async function updateSegment(uuidArr, currentBatch, segmentedAccs) {
  if (!uuidArr) return;
  Logger.verbose(`Getting batch ${currentBatch} of ${segmentedAccs.length} from webworker!`);
  let workerData;
  try {
    workerData = await requestData(uuidArr);
  } catch (error) {
    Logger.err(error);
    return { remaining: 120, reset: 0 };
  }

  for (const uuid of uuidArr) {
    Logger.verbose(`Setting data for ${uuid}`);
    const accData = workerData.data[uuid];
    if (accData?.success == false || accData?.player == undefined) {
      if (cfg.logRateLimit) {
        Logger.warn(`Unable to access data for ${uuid}`);
      } else {
        Logger.verbose(`Unable to access data for ${uuid}`);
      }
    } else {
      const acc = new Account(uuid, 0, uuid);
      Logger.verbose("Merging data into master document");
      masterDoc = mergeDeep(masterDoc, accData);
      acc.setHypixel(accData);

      acc.discord = disclist[acc.uuid];

      Logger.verbose("Pushing data to mongo");
      Database.addAccount(acc)
        .then(() => {})
        .catch(error => Logger.err(error.stack));
    }
  }

  return workerData.key;
}

/**
 * Update the player data for all players in the list
 *
 * @param {string[]} uuids
 * @returns {Promise<Account[]>}
 */
async function fastUpdate(uuids) {
  const perSegment = cfg.hypixel.segmentSize;

  // eslint-disable-next-line unicorn/no-array-reduce
  const segmentedAccs = uuids.reduce((resultArray, item, index) => {
    const segmentIndex = Math.floor(index / perSegment);

    if (!resultArray[segmentIndex]) {
      resultArray[segmentIndex] = [];
    }

    resultArray[segmentIndex].push(item);

    return resultArray;
  }, []);

  for (let i = 0; i < segmentedAccs.length; i += 1) {
    Logger.log(`Batching ${i} - ${i + 5} of ${segmentedAccs.length}`);

    const batches = [updateSegment(segmentedAccs[i], i, segmentedAccs)];
    for (let j = 1; j < cfg.hypixel.concurrentBatches; j++) {
      batches.push(updateSegment(segmentedAccs[(i += 1)], i, segmentedAccs));
    }

    const times = await Promise.all(batches);

    let minKey = { remaining: 120, reset: 0 };
    for (const key of times) {
      if ((key?.remaining ?? 120) < minKey.remaining) {
        minKey = key;
      }
    }

    if (minKey.remaining < perSegment + 5) {
      Logger.warn(`Nearing rate limit sleeping for ${(minKey?.reset ?? 3) * 1000}ms`);
      await Sleep(minKey.reset * 1005);
    }
  }
}

/**
 */
async function miniUpdater() {
  cfg = require("hyarcade-config").fromJSON();

  if (!cfg.hypixel.autoUpdate) {
    return;
  }
  let forceLevel = 2;

  Logger.name = "Data-Generator";
  Logger.emoji = "📈";

  try {
    const fileData = await fs.readFile("force");
    forceLevel = fileData.toString() == "" ? 2 : Number(fileData.toString());
    await fs.rm("force");
  } catch {
    forceLevel = 0;
  }

  const uuidArr = await Database.internal({ fetchImportant: forceLevel });
  Logger.info(`Preparing to update ${uuidArr.length} accounts`);

  const masterFile = await readFile("data/fullplayer.json");
  masterDoc = masterFile.toJSON();

  if (cfg.clusters[cfg.cluster].flags.includes("useWorkers")) {
    Logger.info("Using worker updating system");
    const list = await Database.readDB("discordList");
    const disclist = {};

    for (const link of list) {
      disclist[link.uuid] = link.discordID;
    }

    await fastUpdate(uuidArr);
  }

  Logger.log("Overwriting data for master API document");

  delete masterDoc.data;
  masterDoc.player.displayname = "playerName";
  masterDoc.player.playername = "playername";
  masterDoc.player.uuid = "00000000000000000000000000000000";

  const orderedDoc = Object.keys(masterDoc)
    .sort()
    .reduce((obj, key) => {
      obj[key] = masterDoc[key];
      return obj;
    }, {});

  for (const key in orderedDoc.player) {
    if (key.startsWith("claimed_solo_bank_") || key.startsWith("claimed_coop_bank_")) {
      delete orderedDoc.player[key];
    }
  }

  orderedDoc.player.claimed_solo_bank_00000000000000000000000000000000 = 0;
  orderedDoc.player.claimed_coop_bank_00000000000000000000000000000000 = 0;

  for (const key in orderedDoc.player.housingMeta) {
    if (key.startsWith("given_cookies_")) {
      delete orderedDoc.player[key];
    }
  }

  orderedDoc.player.housingMeta.given_cookies_000000 = ["00000000-0000-0000-0000-000000000000"];

  orderedDoc.player.stats.SkyBlock.profiles = {
    "00000000000000000000000000000000": {
      profile_id: "00000000000000000000000000000000",
      cute_name: "green",
    },
  };

  orderedDoc.player = Object.keys(orderedDoc.player)
    .sort()
    .reduce((obj, key) => {
      obj[key] = orderedDoc.player[key];
      return obj;
    }, {});

  await writeFile("data/fullplayer.json", JSON.stringify(orderedDoc, undefined, 2));

  Logger.info("Update completed");
}

module.exports = miniUpdater;
