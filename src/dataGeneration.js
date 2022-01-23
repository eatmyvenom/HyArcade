const lists = require("./listParser");
const updateAccounts = require("../systems/datagen/updateAccounts");
const {
  addAccounts
} = require("./listUtils");
const Account = require("hyarcade-requests/types/Account");
const { HypixelApi } = require("hyarcade-requests");
const Json = require("hyarcade-utils/FileHandling/Json");

/**
 *
 */
async function saveBoosters () {
  const boosters = await HypixelApi.boosters();
  await Json.write("boosters.json", boosters);
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
  const leaders = await HypixelApi.leaderboards();
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
  const guild = await HypixelApi.guild(uuid);
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
  const guild = await HypixelApi.guild(id);
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
    const guild = await HypixelApi.guild(id);
    const gmembers = guild?.guild?.members ?? [];
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
