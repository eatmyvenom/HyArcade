/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/prefer-object-from-entries */
const Runtime = require("hyarcade-config/Runtime");
const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const Account = require("hyarcade-requests/types/Account");
const Sleep = require("hyarcade-utils/Sleep");
const HyarcadeWorkerRequest = require("hyarcade-requests/HyarcadeWorkerRequest");
const { readFile, writeFile } = require("fs-extra");

let cfg;
let masterDoc;

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
 * @param {MongoConnector} connector
 * @param {*} currentBatch
 * @param {*} segmentedAccs
 * @returns {*}
 */
async function updateSegment(uuidArr, connector, currentBatch, segmentedAccs) {
  if (!uuidArr) return;
  Logger.verbose(`Getting batch ${currentBatch} of ${segmentedAccs.length} from webworker!`);
  let workerData;
  try {
    workerData = await requestData(uuidArr);
  } catch (error) {
    Logger.err(error);
    return;
  }

  for (const uuid of uuidArr) {
    Logger.verbose(`Setting data for ${uuid}`);
    const accData = workerData.data[uuid];
    if (accData?.success == false || accData?.player == undefined) {
      if (cfg.logRateLimit) {
        Logger.warn(`Account data retrevial unsuccessful for ${uuid}`);
      } else {
        Logger.verbose(`Account data retrevial unsuccessful for ${uuid}`);
      }
    } else {
      const acc = new Account(uuid, 0, uuid);
      masterDoc = mergeDeep(masterDoc, accData);
      acc.setHypixel(accData);

      connector
        .updateAccount(acc)
        .then(() => {})
        .catch(Logger.err);
    }
  }

  return workerData.key;
}

/**
 * Update the player data for all players in the list
 *
 * @param {string[]} uuids
 * @param connector
 * @returns {Promise<Account[]>}
 */
async function fastUpdate(uuids, connector) {
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
    const times = await Promise.all([
      updateSegment(segmentedAccs[i], connector, i, segmentedAccs),
      updateSegment(segmentedAccs[(i += 1)], connector, i, segmentedAccs),
      updateSegment(segmentedAccs[(i += 1)], connector, i, segmentedAccs),
      updateSegment(segmentedAccs[(i += 1)], connector, i, segmentedAccs),
      updateSegment(segmentedAccs[(i += 1)], connector, i, segmentedAccs),
      updateSegment(segmentedAccs[(i += 1)], connector, i, segmentedAccs),
    ]);

    let minKey = { remaining: 120, reset: 0 };
    for (const key of times) {
      if (key.remaining < minKey.remaining) {
        minKey = key;
      }
    }

    if (minKey.remaining < perSegment + 5) {
      Logger.warn(`Nearing rate limit sleeping for ${minKey.key.reset * 1000}ms`);
      await Sleep(minKey.reset * 1005);
    }
  }

  const runtime = Runtime.fromJSON();
  runtime.needRoleupdate = true;
  await runtime.save();
}

/**
 * @param uuidArr
 * @param {MongoConnector} connector
 */
async function miniUpdater(uuidArr, connector) {
  cfg = require("hyarcade-config").fromJSON();

  const masterFile = await readFile("data/fullplayer.json");
  masterDoc = masterFile.toJSON();

  if (cfg.clusters[cfg.cluster].flags.includes("useWorkers")) {
    Logger.info("Using worker updating system");
    await fastUpdate(uuidArr, connector);
  }

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

  orderedDoc.player = Object.keys(orderedDoc.player)
    .sort()
    .reduce((obj, key) => {
      obj[key] = orderedDoc.player[key];
      return obj;
    }, {});

  orderedDoc.player.stats.profiles = {
    "00000000000000000000000000000000": {
      profile_id: "00000000000000000000000000000000",
      cute_name: "green",
    },
  };

  await writeFile("data/fullplayer.json", JSON.stringify(orderedDoc, undefined, 2));
}

module.exports = miniUpdater;
