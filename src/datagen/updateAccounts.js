const logger = require("hyarcade-logger");
const utils = require("../utils");
const cfg = require("../Config").fromJSON();
const force = utils.fileExists("force") || cfg.alwaysForce;
const Runtime = require("../Runtime");
const fs = require("fs-extra");
const Account = require("hyarcade-requests/types/Account");
const HyarcadeWorkerRequest = require("../request/HyarcadeWorkerRequest");
const { sleep } = require("../utils");
const NormalizeAccount = require("./utils/NormalizeAccount");
const HypixelApi = require("hyarcade-requests/HypixelApi");
const Util = require("util");

class Response {
  key = {};
  data = [];
}

/**
 * 
 * @param {object[]} guildlist the raw guild list
 * @param {string} uuid the players uuid
 * @returns {object} The guild of the specified player
 */
function getGuild (guildlist, uuid) {
  for(const guild of guildlist) {
    if(guild.memberUUIDs.includes((`${uuid}`).toLowerCase())) {
      return guild;
    }
  }
}

/**
 * @param {object} object
 * @param {string} value
 * @returns {any} The value in the object 
 */
function getKeyByValue (object, value) {
  return Object.keys(object).find((key) => object[key] == value);
}

/**
 * 
 * @param {Account[]} accounts 
 * @returns {Promise<Account[]>}
 */
async function fakeStats (accounts) {
  try {
    const fakeFile = await utils.readJSON("fakeStats.json");

    for (const acc of accounts) {
      if(Object.keys(fakeFile).includes(acc.uuid)) {
        logger.log(`Setting data for ${acc.name}`);
        Object.assign(acc, fakeFile[acc.uuid]);
      }
    }

    return accounts;
  } catch (e) {
    logger.err("Fake stats file unaccessable");
    return accounts;
  }
}

/**
 * 
 * @param {Account[]} accounts
 * @returns {Promise<Account[]>}
 */
async function discordIDs (accounts) {
  const disclist = await utils.readJSON("disclist.json");

  for (const acc of accounts) {
    acc.discord = getKeyByValue(disclist, acc.uuid);
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts
 * @returns {Promise<Account[]>}
 */
async function importance (accounts) {
  for (const acc of accounts) {
    acc.importance = NormalizeAccount(acc);
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts
 * @returns {Promise<Account[]>}
 */
async function coins (accounts) {
  const leaderboards = await HypixelApi.leaderboards();

  const arcade = leaderboards.leaderboards.ARCADE;

  /** @type {string[]} */
  const lifetime = arcade[0].leaders;

  /** @type {string[]} */
  const weekly = arcade[1].leaders;

  /** @type {string[]} */
  const monthly = arcade[2].leaders;

  for (const acc of accounts) {
    if(acc.positions == undefined) {
      acc.positions = {};
    }

    const isLifetime = lifetime.includes(acc.uuidPosix);

    if(acc.positions.coins < 76 && !isLifetime) {
      acc.banned = true;
    }

    if(isLifetime) {
      acc.positions.ingameCoins = weekly.indexOf(acc.uuidPosix) + 1;
    }

    if(weekly.includes(acc.uuidPosix)) {
      acc.positions.weeklyCoins = weekly.indexOf(acc.uuidPosix) + 1;
    }

    if(monthly.includes(acc.uuidPosix)) {
      acc.positions.monthlyCoins = monthly.indexOf(acc.uuidPosix) + 1;
    }
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts
 * @param {Function} sorter
 * @param {string} key
 * @returns {Promise<Account[]>}
 */
async function leaderboardStat (accounts, sorter, key) {
  accounts.sort(sorter);

  for(let i = 0; i < accounts.length; i += 1) {
    if(accounts[i].positions == undefined) {
      accounts[i].positions = {};
    }

    accounts[i].positions[key] = i + 1;
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts
 * @returns {Promise<Account[]>}
 */
async function leaderboards (accounts) {
  let accs = await leaderboardStat(accounts, (a, b) => b.blockingDead.wins - a.blockingDead.wins, "blockingDead");
  accs = await leaderboardStat(accounts, (a, b) => b.bountyHunters.wins - a.bountyHunters.wins, "bountyHunters");
  accs = await leaderboardStat(accounts, (a, b) => b.dragonWars.wins - a.dragonWars.wins, "dragonWars");
  accs = await leaderboardStat(accounts, (a, b) => b.captureTheWool.kills - a.captureTheWool.kills, "ctwKills");
  accs = await leaderboardStat(accounts, (a, b) => b.captureTheWool.woolCaptures - a.captureTheWool.woolCaptures, "ctwCaptures");
  accs = await leaderboardStat(accounts, (a, b) => b.arcadeWins - a.arcadeWins, "arcadeWins");
  accs = await leaderboardStat(accounts, (a, b) => b.enderSpleef.wins - a.enderSpleef.wins, "enderSpleef");
  accs = await leaderboardStat(accounts, (a, b) => b.farmhunt.wins - a.farmhunt.wins, "farmhunt");
  accs = await leaderboardStat(accounts, (a, b) => b.football.wins - a.football.wins, "football");
  accs = await leaderboardStat(accounts, (a, b) => b.galaxyWars.wins - a.galaxyWars.wins, "galaxyWars");
  accs = await leaderboardStat(accounts, (a, b) => b.hideAndSeek.wins - a.hideAndSeek.wins, "hideAndSeek");
  accs = await leaderboardStat(accounts, (a, b) => b.holeInTheWall.wins - a.holeInTheWall.wins, "holeInTheWall");
  accs = await leaderboardStat(accounts, (a, b) => b.hypixelSays.wins - a.hypixelSays.wins, "hypixelSays");
  accs = await leaderboardStat(accounts, (a, b) => b.partyGames.wins - a.partyGames.wins, "partyGames");
  accs = await leaderboardStat(accounts, (a, b) => b.pixelPainters.wins - a.pixelPainters.wins, "pixelPainters");
  accs = await leaderboardStat(accounts, (a, b) => b.throwOut.wins - a.throwOut.wins, "throwOut");
  accs = await leaderboardStat(accounts, (a, b) => b.miniWalls.wins - a.miniWalls.wins, "miniWalls");
  accs = await leaderboardStat(accounts, (a, b) => b.zombies.wins_zombies - a.zombies.wins_zombies, "zombies");
  accs = await leaderboardStat(accounts, (a, b) => b.simTotal - a.simTotal, "simTotal");
  accs = await leaderboardStat(accounts, (a, b) => b.arcadeCoins - a.arcadeCoins, "coins");

  return accs;
}

/**
 * 
 * @param {Account[]} accounts 
 * @returns {Promise<Account[]>}
 */
async function guilds (accounts) {
  const guildlist = await utils.readJSON("guild.json");

  for (const acc of accounts) {
    const guild = getGuild(guildlist, acc.uuid);
    if(guild) {
      acc.guildID = guild.uuid;
      acc.guild = guild.name;
      acc.guildTag = guild.tag;
      acc.guildTagColor = guild.color;
    } else {
      acc.guildID = undefined;
      acc.guild = "NONE";
      acc.guildTag = "NONE";
      acc.guildTagColor = "";
    }
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts 
 * @returns {Promise<Account[]>}
 */
async function hackerlist (accounts) {
  const hackerlist = await fs.readFile("data/hackerlist");

  for (const acc of accounts) {
    acc.hacker = hackerlist.includes(acc.uuid);
  }

  return accounts;
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

  await updatedAccs.sort(utils.winsSorter);

  updatedAccs = uniqBy(updatedAccs, (a) => a.uuid);
  updatedAccs = await fakeStats(updatedAccs);
  updatedAccs = await discordIDs(updatedAccs);
  updatedAccs = await guilds(updatedAccs);
  updatedAccs = await hackerlist(updatedAccs);
  updatedAccs = await leaderboards(updatedAccs);
  updatedAccs = await coins(updatedAccs);
  updatedAccs = await importance(updatedAccs);



  return updatedAccs;
}

/**
 * Update the player data for all players in the list
 *
 * @param {Account[]} accounts
 * @param {boolean} argForce
 * @returns {Promise<Account[]>}
 */
module.exports = async function updateAccounts (accounts, argForce = false) {

  if(cfg.clusters[cfg.cluster].flags.includes("useWorkers")) {
    logger.info("Using worker updating system");
    const accs = await fastUpdate(accounts, argForce);
    if(force && utils.fileExists("force")) {
      await fs.rm("force");
    }
    return accs;
  }

  await fs.writeFile("starttime", (`${Date.now()}`));

  const oldAccs = accounts;

  let i;
  let j;
  let temparray;

  const chunk = 120;
  for(i = 0, j = accounts.length; i < j; i += chunk) {
    temparray = accounts.slice(i, i + chunk);
    await updateAccountsInArr(temparray, oldAccs);
  }

  const runtime = Runtime.fromJSON();
  runtime.needRoleupdate = true;
  await runtime.save();

  if(force && utils.fileExists("force")) {
    await fs.rm("force");
  }

  return accounts;
};

/**
 * @param {Account[]} accounts
 * @param {Account[]} oldAccs
 * @returns {Promise}
 */
async function updateAccountsInArr (accounts, oldAccs) {
  return await Promise.all(
    accounts.map(async (account) => {
      const oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
      if(isImportant(oldAcc)) {
        logger.out(`Updating ${oldAcc?.name}'s data`);
        await account.updateData();
      } else {
        logger.info(`Ignoring ${oldAcc?.name} for this refresh`);
        account.setData(oldAcc);
      }
    })
  );
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

  if(force) {
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
