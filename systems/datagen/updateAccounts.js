const logger = require("hyarcade-logger");
const fs = require("fs-extra");
const Runtime = require("hyarcade-config/Runtime");
const Account = require("hyarcade-requests/types/Account");
const HyarcadeWorkerRequest = require("hyarcade-requests/HyarcadeWorkerRequest");
const sleep = require("hyarcade-utils/Sleep");
const NormalizeAccount = require("./utils/NormalizeAccount");
const Util = require("util");

const force = fs.existsSync("force");
let cfg;

class Response {
  key = {};
  data = [];
}

/**
 * 
 * @param {string[]} uuids 
 * @returns {Response}
 */
async function requestData (uuids) {

  const realUUIDs = uuids.filter((u) => u != "");

  try {
    return await HyarcadeWorkerRequest(realUUIDs);
  } catch (e) {
    logger.err(e.stack);
    logger.debug("Requesting data again!");
    return await requestData(realUUIDs);
  }
}


/**
 * 
 * @param {Account} account 
 * @returns {boolean}
 */
function isLeaderboarder (account) {
  if(account.positions) {
    return Object.values(account.positions).some((pos) => pos < cfg.leaderboardLimit);
  }

  return false;
}

/**
 * 
 * @param {Account} oldAcc 
 * @returns {boolean}
 */
function isImportant (oldAcc) {

  if(oldAcc == undefined) {
    return true;
  }

  if(oldAcc.null) {
    return false;
  }

  const hasImportantStats = NormalizeAccount(oldAcc) >= cfg.importanceLimit;

  // Linked players should update more often since they will check their own stats
  const isLinked = !!oldAcc.discord;

  // Ignore people who have not played within the last 3 days
  const hasPlayedRecently = Date.now() - oldAcc.lastLogout < cfg.loginLimit;

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
async function updateSegment (accs, currentBatch, updatedAccs, segmentedAccs, perSegment) {
  if(accs == undefined) {
    return;
  }
  const uuidArr = [];

  for (const acc of accs) {
    uuidArr.push(acc.uuid);
  }

  logger.verbose(`Getting batch ${currentBatch} of ${segmentedAccs.length} from webworker!`);
  const workerData = await requestData(uuidArr);

  if(workerData.key.remaining < perSegment + 5) {
    logger.info(`Nearing rate limit sleeping for ${workerData.key.reset * 1000}ms`);
    await sleep(workerData.key.reset * 1005);
  }

  for (const acc of accs) {
    logger.verbose(`Setting data for ${acc.uuid}`);
    const accData = workerData.data[acc.uuid];
    if(accData?.success == false || accData?.player == undefined) {
      if(cfg.logRateLimit) {
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
function uniqBy (a, key) {
  const seen = {};
  return a.filter((item) => {
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
async function fastUpdate (accounts, argForce) {
  const perSegment = cfg.segmentSize;

  const oldAccs = accounts;

  let importantAccounts = [];

  for (const acc of oldAccs) {
    if(argForce || isImportant(acc)) {
      importantAccounts.push(acc);
    }
  }

  importantAccounts = importantAccounts.concat(oldAccs.sort((a, b) => a.updateTime - b.updateTime).slice(0, perSegment));

  const segmentedAccs = importantAccounts.reduce((resultArray, item, index) => { 
    const segmentIndex = Math.floor(index / perSegment);

    if(!resultArray[segmentIndex]) {
      resultArray[segmentIndex] = [];
    }

    resultArray[segmentIndex].push(item);

    return resultArray;
  }, []);

  let updatedAccs = [];

  for(let i = 0;i < segmentedAccs.length; i += 1) {
    logger.log(`Batching ${i} - ${i + 5} of ${segmentedAccs.length}`);
    await Promise.all([
      updateSegment(segmentedAccs[i], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[i += 1], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[i += 1], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[i += 1], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[i += 1], i, updatedAccs, segmentedAccs, perSegment),
      updateSegment(segmentedAccs[i += 1], i, updatedAccs, segmentedAccs, perSegment),
    ]);
  }

  const runtime = Runtime.fromJSON();
  runtime.needRoleupdate = true;
  await runtime.save();

  updatedAccs = uniqBy(updatedAccs, (a) => a.uuid);

  return updatedAccs;
}

/**
 * @param {Account[]} accounts
 * @param {Account[]} oldAccs
 * @param {boolean} argForce
 * @returns {Promise}
 */
async function updateAccountsInArr (accounts, oldAccs, argForce) {
  return await Promise.all(
    accounts.map(async (account) => {
      const oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
      if(argForce || isImportant(oldAcc)) {
        logger.verbose(`Updating ${oldAcc?.name}'s data`);
        await account.updateData();
      } else {
        logger.verbose(`Ignoring ${oldAcc?.name} for this refresh`);
        account.setData(oldAcc);
      }
    })
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
module.exports = async function updateAccounts (accounts, argForce = false, fast = false) {

  cfg = require("hyarcade-config").fromJSON();

  if(fast || cfg.clusters[cfg.cluster].flags.includes("useWorkers")) {
    logger.info("Using worker updating system");
    const accs = await fastUpdate(accounts, argForce);
    if(force && fs.existsSync("force")) {
      await fs.rm("force");
    }
    return accs;
  }

  await fs.writeFile("starttime", (`${Date.now()}`));

  const oldAccs = accounts;

  let i;
  let temparray;

  const chunk = 120;
  for(i = 0; i < accounts.length; i += chunk) {
    const percent = Math.max(Math.round((i / accounts.length) * 100), Math.floor((i / accounts.length) * 100));

    if(percent % 5 == 0) {
      logger.debug(`${percent}% processed!`);
    }
    temparray = accounts.slice(i, i + chunk);
    await updateAccountsInArr(temparray, oldAccs, argForce);
  }

  const runtime = Runtime.fromJSON();
  runtime.needRoleupdate = true;
  await runtime.save();

  let updatedAccs = accounts;

  updatedAccs = uniqBy(updatedAccs, (a) => a.uuid);
  return updatedAccs;
};
