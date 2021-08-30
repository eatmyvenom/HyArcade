const status = require("./status");
const utils = require("./utils");
const fs = require("fs/promises");
const lists = require("./listParser");
const hypixelAPI = require("./hypixelApi");
const updateAccounts = require("./datagen/updateAccounts");
const {
  addAccounts
} = require("./listUtils");
const Account = require("hyarcade-requests/types/Account");

/**
 * Generates the status for all of the online players
 *
 */
async function genStatus () {
  const statusObj = {};
  const accdata = await utils.readJSON("accounts.json");
  const acclist = await lists.accounts();
  const {
    accounts
  } = acclist;

  await Promise.all(
    accounts.map(async (account) => {
      const thisdata = accdata.find((acc) => acc.uuid == account.uuid);
      if(thisdata && thisdata.isLoggedIn) {
        const response = await hypixelAPI.getStatus(account.uuid);
        statusObj[account.uuid] = response.session;
      }
    })
  );

  await Promise.all([
    // write object
    utils.writeJSON("status.json", statusObj),
    // store the cache misses
    utils.writeJSON("cachemiss.json", utils.cacheMiss),
  ]);
  await statusTxtSorted();
}

/**
 *
 */
async function saveBoosters () {
  const boosters = await hypixelAPI.getBoosters();
  await utils.writeJSON("boosters.json", boosters);
}

/**
 *
 */
async function statusTxtSorted () {
  let str = "";
  const acclist = await lists.accounts();
  const accs = acclist.accounts;

  const crntstatus = await utils.readJSON("status.json");
  const sortable = Object.entries(crntstatus).sort(statusSort)
    .reverse();

  for(const sts of sortable) {
    const acc = await accs.find((a) => a.uuid == sts[0]);
    str += await status.genStatus(acc.name, sts[1]);
  }

  await fs.writeFile("status.txt", `${str}`);
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {string[]}
 */
function statusSort (a, b) {
  const status1 = a[1];
  const status2 = b[1];

  // sanitize
  status1.mode = (`${status1.mode}`).toUpperCase();
  status2.mode = (`${status2.mode}`).toUpperCase();
  status1.gameType = (`${status1.gameType}`).toUpperCase();
  status2.gameType = (`${status2.gameType}`).toUpperCase();

  if(status1.mode == "LOBBY" && status2.mode != "LOBBY") {
    return -1;
  }
  if(status2.mode == "LOBBY" && status1.mode != "LOBBY") {
    return 1;
  }
  if(status1.mode == "PARTY" && status2.mode != "PARTY") {
    return 1;
  }
  if(status2.mode == "PARTY" && status1.mode != "PARTY") {
    return -1;
  }
  if(status1.mode == "FARM_HUNT" && status2.mode != "FARM_HUNT") {
    return 1;
  }
  if(status2.mode == "FARM_HUNT" && status1.mode != "FARM_HUNT") {
    return -1;
  }
  if(status1.gameType == "ARCADE" && status2.gameType != "ARCADE") {
    return 1;
  }
  if(status2.gameType == "ARCADE" && status1.gameType != "ARCADE") {
    return -1;
  }
  if(status1.gameType == "SKYBLOCK" && status2.mode != "SKYBLOCK") {
    return -1;
  }
  if(status2.gameType == "SKYBLOCK" && status1.mode != "SKYBLOCK") {
    return 1;
  }
  if(status1.gameType > status2.gameType) {
    return -1;
  }
  if(status1.gameType < status2.gameType) {
    return 1;
  }
  if(status1.mode > status2.mode) {
    return -1;
  }
  if(status1.mode < status2.mode) {
    return 1;
  }
  if(a[0] > b[0]) {
    return 1;
  }
  if(b[0] > a[0]) {
    return -1;
  }
  return 0;
}

/**
 * Update the player data for all players in the list
 *
 * @returns {Account[]}
 */
async function updateAllAccounts () {
  const acclist = await lists.accounts();
  const {
    accounts
  } = acclist;
  return await updateAccounts(accounts);
}

/**
 *
 */
async function addLeaderboards () {
  const leaders = await hypixelAPI.getLeaderboards();
  const arcade = leaders.leaderboards.ARCADE;
  const lifetimeCoins = arcade[0].leaders;
  const monthlyCoins = arcade[2].leaders;
  const weeklyCoins = arcade[1].leaders;

  await addAccounts("others", lifetimeCoins);
  await addAccounts("others", monthlyCoins);
  await addAccounts("others", weeklyCoins);
}

/**
 * @param {string} uuid
 */
async function addGuild (uuid) {
  const guild = JSON.parse(await hypixelAPI.getGuildFromPlayer(uuid));
  const {
    members
  } = guild.guild;
  const uuids = [];
  for(const m of members) {
    uuids.push(m.uuid);
  }

  await addAccounts("others", uuids);
}

/**
 * @param {string} id
 */
async function addGuildID (id) {
  const guild = JSON.parse(await hypixelAPI.getGuildRaw(id));
  const {
    members
  } = guild.guild;
  const uuids = [];
  for(const m of members) {
    uuids.push(m.uuid);
  }

  await addAccounts("others", uuids);
}

module.exports = {
  genStatus,
  updateAllAccounts,
  statusTxtSorted,
  addGuild,
  addGuildID,
  addLeaderboards,
  saveBoosters,
};
