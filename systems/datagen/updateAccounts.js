const fs = require("fs-extra");
const logger = require("@hyarcade/logger");
const HyarcadeWorkerRequest = require("@hyarcade/requests/HyarcadeWorkerRequest");
const sleep = require("@hyarcade/utils/Sleep");
const Sleep = require("@hyarcade/utils/Sleep");
const Util = require("node:util");
const NormalizeAccount = require("./utils/NormalizeAccount");
const { Account } = require("@hyarcade/account");

const force = fs.existsSync("force");
let cfg;

class Response {
  key = {};
  data = [];
}

/**
 *
 */
function timeout() {
  return new Promise((resolve, reject) => {
    Sleep(30000).then(reject).catch(reject);
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
    logger.err(error);
    logger.debug("Requesting data again!");
    return requestData(realUUIDs);
  }
}

/**
 *
 * @param {Account} account
 * @returns {boolean}
 */
function isLeaderboarder(account) {
  if (account.positions) {
    return Object.values(account.positions).some(pos => pos < cfg.hypixel.leaderboardLimit);
  }

  return false;
}

/**
 *
 * @param {Account} oldAcc
 * @returns {boolean}
 */
function isImportant(oldAcc) {
  if (oldAcc == undefined) {
    return true;
  }

  if (oldAcc.null) {
    return false;
  }

  const hasImportantStats = NormalizeAccount(oldAcc) >= cfg.hypixel.importanceLimit;

  // Linked players should update more often since they will check their own stats
  const isLinked = !!oldAcc.discord;

  // Ignore people who have not played within a tolerance value
  const hasPlayedRecently = Date.now() - oldAcc.lastLogout < cfg.hypixel.loginLimit;

  const meetsRequirements = (isLinked || hasImportantStats) && hasPlayedRecently;

  return meetsRequirements || isLeaderboarder(oldAcc);
}

/**
 *
 * @param {*} accs
 * @param {*} currentBatch
 * @param {*} updatedAccs
 * @param {*} segmentedAccs
 * @param {*} perSegment
 */
async function updateSegment(accs, currentBatch, updatedAccs, segmentedAccs, perSegment) {
  if (accs == undefined) {
    return;
  }
  const uuidArr = [];

  for (const acc of accs) {
    uuidArr.push(acc.uuid);
  }

  logger.verbose(`Getting batch ${currentBatch} of ${segmentedAccs.length} from webworker!`);
  let workerData;
  try {
    workerData = await requestData(uuidArr);
  } catch (error) {
    logger.err(error);
    return;
  }

  if (workerData.key.remaining < perSegment + 5) {
    logger.debug(`Nearing rate limit sleeping for ${workerData.key.reset * 1000}ms`);
    await sleep(workerData.key.reset * 1005);
  }

  for (const acc of accs) {
    logger.verbose(`Setting data for ${acc.uuid}`);
    const accData = workerData.data[acc.uuid];
    if (accData?.success == false || accData?.player == undefined) {
      if (cfg.logRateLimit) {
        logger.warn(`Account data retrevial unsuccessful for ${acc.uuid}`);
      } else {
        logger.verbose(`Account data retrevial unsuccessful for ${acc.uuid}`);
      }
      logger.verbose(Util.inspect(accData, true));
      acc.null = true;
    } else {
      acc.setHypixel(accData);
      updatedAccs.push(acc);
    }
  }
}

/**
 *
 * @param {Array} a
 * @param {Function} key
 * @returns {Array}
 */
function uniqBy(a, key) {
  const seen = {};
  return a.filter(item => {
    const k = key(item);
    // eslint-disable-next-line no-prototype-builtins
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

/**
 * Update the player data for all players in the list
 *
 * @param {Account[]} accounts
 * @param {boolean} argForce
 * @returns {Promise<Account[]>}
 */
// eslint-disable-next-line no-unused-vars
async function fastUpdate(accounts, argForce) {
  const perSegment = cfg.hypixel.segmentSize;

  const oldAccs = accounts;

  let importantAccounts = [];

  for (const acc of oldAccs) {
    if (argForce) {
      if (NormalizeAccount(acc) > cfg.hypixel.minImportance) {
        importantAccounts.push(acc);
      }
    } else if (isImportant(acc)) {
      importantAccounts.push(acc);
    }
  }

  importantAccounts = [
    ...importantAccounts,
    ...oldAccs
      .filter(a => (a?.importance ?? 0) > 1000)
      .sort((a, b) => a.updateTime - b.updateTime)
      .slice(0, perSegment * 4),
  ];

  // eslint-disable-next-line unicorn/no-array-reduce
  const segmentedAccs = importantAccounts.reduce((resultArray, item, index) => {
    const segmentIndex = Math.floor(index / perSegment);

    if (!resultArray[segmentIndex]) {
      resultArray[segmentIndex] = [];
    }

    resultArray[segmentIndex].push(item);

    return resultArray;
  }, []);

  let updatedAccs = [];

  for (let i = 0; i < segmentedAccs.length; i += 1) {
    logger.log(`Batching ${i} - ${i + 5} of ${segmentedAccs.length}`);
    await Promise.all([
      updateSegment(segmentedAccs[i], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[(i += 1)], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[(i += 1)], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[(i += 1)], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[(i += 1)], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[(i += 1)], i, updatedAccs, segmentedAccs, perSegment),
    ]);
  }

  updatedAccs = uniqBy(updatedAccs, a => a.uuid);

  return updatedAccs;
}

/**
 * @param {Account[]} accounts
 * @param {Account[]} oldAccs
 * @param {boolean} argForce
 * @returns {Promise}
 */
async function updateAccountsInArr(accounts, oldAccs, argForce) {
  return await Promise.all(
    accounts.map(async account => {
      const oldAcc = oldAccs.find(a => a.uuid == account.uuid);
      if (argForce || isImportant(oldAcc)) {
        logger.verbose(`Updating ${oldAcc?.name}'s data`);
        await account.updateData();
      } else {
        logger.verbose(`Ignoring ${oldAcc?.name} for this refresh`);
        account.setData(oldAcc);
      }
    }),
  );
}

/**
 * Update the player data for all players in the list
 *
 * @param {Account[]} accounts
 * @param {boolean} argForce
 * @param {boolean} fast
 * @returns {Promise<Account[]>}
 */
module.exports = async function updateAccounts(accounts, argForce = false, fast = false) {
  cfg = require("@hyarcade/config").fromJSON();

  if (fast || cfg.clusters[cfg.cluster].flags.includes("useWorkers")) {
    logger.info("Using worker updating system");
    const accs = await fastUpdate(accounts, argForce);
    if (force && fs.existsSync("force")) {
      await fs.rm("force");
    }
    return accs;
  }

  await fs.writeFile("starttime", `${Date.now()}`);

  const oldAccs = accounts;

  let i;
  let temparray;

  const chunk = 120;
  for (i = 0; i < accounts.length; i += chunk) {
    const percent = Math.max(Math.round((i / accounts.length) * 100), Math.floor((i / accounts.length) * 100));

    if (percent % 5 == 0) {
      logger.debug(`${percent}% processed!`);
    }
    temparray = accounts.slice(i, i + chunk);
    await updateAccountsInArr(temparray, oldAccs, argForce);
  }

  let updatedAccs = accounts;

  updatedAccs = uniqBy(updatedAccs, a => a.uuid);
  return updatedAccs;
};
