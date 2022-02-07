const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const Guild = require("hyarcade-structures/Guild");

/**
 * Gets a list of account object from the json account list
 *
 * @returns {Promise<Account[]>} All of the accounts in the database
 */
exports.accounts = async function accounts() {
  return AccountArray(await Database.readDB("accounts"));
};

/**
 * Gets a list of guild objects from the json guild list
 *
 * @returns {Promise<Guild[]>} Array of guilds with combined player data
 */
exports.guilds = async function gld() {
  /**
   * @type {Guild[]}
   */
  const guildlistjson = await Database.readDB("guilds");
  const realList = [];

  for (const gli of guildlistjson) {
    if (!realList.some(g => g.uuid == gli.uuid)) {
      realList.push(new Guild(gli.uuid));
    }
  }
  return realList;
};
