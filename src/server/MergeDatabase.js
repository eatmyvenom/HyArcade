const Logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const utils = require("../utils");
const FileCache = require("../utils/files/FileCache");
const NormalizeAccount = require("../datagen/utils/NormalizeAccount");

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
 * 
 * @param {Account[]} accounts 
 * @returns {Promise<Account[]>}
 */
async function fakeStats (accounts) {
  try {
    const fakeFile = await utils.readJSON("fakeStats.json");

    for (const acc of accounts) {
      if(Object.keys(fakeFile).includes(acc.uuid)) {
        Logger.log(`Setting data for ${acc.name}`);
        Object.assign(acc, fakeFile[acc.uuid]);
      }
    }

    return accounts;
  } catch (e) {
    Logger.err("Fake stats file unaccessable");
    return accounts;
  }
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
 * @param {FileCache} fileCache
 * @returns {Promise<Account[]>}
 */
async function discordIDs (accounts, fileCache) {
  const disclist = fileCache?.disclist ?? {};

  for (const acc of accounts) {
    acc.discord = getKeyByValue(disclist, acc.uuid);
  }

  return accounts;
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
 * 
 * @param {Account[]} accounts 
 * @param {FileCache} fileCache
 * @returns {Promise<Account[]>}
 */
async function guilds (accounts, fileCache) {
  const guildlist = fileCache?.guilds ?? [];

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
 * @param {FileCache} fileCache
 * @returns {Promise<Account[]>}
 */
function hackerlist (accounts, fileCache) {
  const hackerlist = fileCache?.hackerlist ?? [];

  for (const acc of accounts) {
    acc.hacker = hackerlist.includes(acc.uuid);
  }

  return accounts;
}

/**
 * 
 * @param {Account[]} accounts 
 * @param {FileCache} fileCache
 * @returns {Promise<Account[]>}
 */
function banlist (accounts, fileCache) {
  const banlist = fileCache?.banlist ?? [];

  for (const acc of accounts) {
    acc.banned = banlist.includes(acc.uuid);
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
      acc.positions.ingameCoins = lifetime.indexOf(acc.uuidPosix) + 1;
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
 * @param {Account[]} accs 
 * @param {FileCache} fileCache 
 * @returns {Promise<Account[]>}
 */
async function applyMetadata (accs, fileCache) {
  let updatedAccs = uniqBy(accs, (a) => a.uuid);
  updatedAccs = await fakeStats(updatedAccs);
  updatedAccs = importance(updatedAccs);
  updatedAccs = discordIDs(updatedAccs, fileCache);
  updatedAccs = guilds(updatedAccs, fileCache);
  updatedAccs = hackerlist(updatedAccs, fileCache);
  updatedAccs = banlist(updatedAccs, fileCache);
  updatedAccs = leaderboards(updatedAccs);
  updatedAccs = await coins(updatedAccs);
  return updatedAccs;
}

module.exports = async function (newAccs, oldAccs, fileCache) {
  const accs = AccountArray([...newAccs, ...oldAccs]);

  Logger.log(`New accounts length is ${accs.length}`);
  return await applyMetadata(accs, fileCache);
};