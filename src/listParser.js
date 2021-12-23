const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const guild = require("./classes/guild");
const utils = require("./utils");

/**
 * Gets a list of account object from the json account list
 *
 * @returns {Promise<Account[]>} All of the accounts in the database
 */
exports.accounts = async function accounts () {
  return AccountArray(await utils.readDB("accounts"));
};

/**
 * Gets a list of guild objects from the json guild list
 *
 * @param {Account[]} accs Accounts that can be used in these guilds
 * @returns {Promise<guild[]>} Array of guilds with combined player data
 */
exports.guilds = async function gld (accs) {
  const accounts = accs ? accs : await exports.accounts();
  const Guild = require("./classes/guild")(accounts);
  const guildlistjson = await utils.readJSON("guildlist.json");
  const realList = [];

  for(const guild of guildlistjson) {
    if(realList.find((g) => g.uuid == guild) == undefined) {
      realList.push(new Guild(guild));
    }
  }
  return realList;
};
