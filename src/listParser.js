const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const Guild = require("hyarcade-structures/Guild");
const Json = require("hyarcade-utils/FileHandling/Json");

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
  const guildlistjson = await Json.read("guildlist.json");
  const realList = [];

  for (const guuid of guildlistjson) {
    if (!realList.some(g => g.uuid == guuid)) {
      realList.push(new Guild(guuid));
    }
  }
  return realList;
};
