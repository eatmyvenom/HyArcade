const utils = require("./utils");
const lists = require("./listParser");
const hypixelAPI = require("./hypixelApi");
const updateAccounts = require("./datagen/updateAccounts");
const {
  addAccounts
} = require("./listUtils");
const Account = require("hyarcade-requests/types/Account");

/**
 *
 */
async function saveBoosters () {
  const boosters = await hypixelAPI.getBoosters();
  await utils.writeJSON("boosters.json", boosters);
}

/**
 * Update the player data for all players in the list
 *
 * @returns {Account[]}
 */
async function updateAllAccounts () {
  const accounts = await lists.accounts();
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

  await addAccounts([...lifetimeCoins, ...monthlyCoins, ...weeklyCoins]);
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

  await addAccounts(uuids);
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

  await addAccounts(uuids);
}

/**
 * @param {string[]} ids
 */
async function addGuildIDs (ids) {
  const uuids = [];

  for(const id of ids) {
    const guild = JSON.parse(await hypixelAPI.getGuildRaw(id));
    const gmembers = guild?.guild?.members;
    for(const m of gmembers) {
      uuids.push(m.uuid);
    }
  }

  await addAccounts(uuids);
}

module.exports = {
  updateAllAccounts,
  addGuild,
  addGuildID,
  addGuildIDs,
  addLeaderboards,
  saveBoosters,
};
