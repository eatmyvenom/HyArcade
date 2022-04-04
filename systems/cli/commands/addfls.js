const Logger = require("@hyarcade/logger");
const { HypixelApi } = require("@hyarcade/requests");
const Database = require("@hyarcade/requests/Database");
const addAccounts = require("../../datagen/addAccounts");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  const accs = await Database.getLeaderboard(args[3], args[4], args[5], false, false, args[6]);
  Logger.out("Data fetched");
  const uuids = accs.map(a => a.uuid);

  const friends = [];

  Logger.out("Fetching all friends");
  for (const uuid of uuids) {
    const freq = await HypixelApi.friends(uuid);
    for (const friend of freq.records) {
      const addUUID = friend.uuidSender == uuid ? friend.uuidReceiver : friend.uuidSender;

      if (!friends.includes(addUUID)) {
        friends.push(addUUID);
      }
    }
  }

  await addAccounts(friends);
}

module.exports = main;
