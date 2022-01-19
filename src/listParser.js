const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const guild = require("hyarcade-structures/Guild");
const Json = require("hyarcade-utils/FileHandling/Json");

/**
 * Gets a list of account object from the json account list
 *
 * @returns {Promise<Account[]>} All of the accounts in the database
 */
exports.accounts = async function accounts () {
  return AccountArray(await Database.readDB("accounts"));
};

/**
 * Gets a list of guild objects from the json guild list
 *
 * @param {Account[]} accs Accounts that can be used in these guilds
 * @returns {Promise<guild[]>} Array of guilds with combined player data
 */
exports.guilds = async function gld (accs) {
  const accounts = accs ? accs : await exports.accounts();
  const Guild = require("hyarcade-structures/Guild")(accounts);
  const guildlistjson = await Json.read("guildlist.json");
  const realList = [];

  for(const guild of guildlistjson) {
    if(realList.find((g) => g.uuid == guild) == undefined) {
      realList.push(new Guild(guild));
    }
  }
  return realList;
};
