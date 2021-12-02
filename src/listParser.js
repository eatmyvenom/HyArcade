const AccountArray = require("hyarcade-requests/types/AccountArray");
const Account = require("./classes/account");
const guild = require("./classes/guild");
const utils = require("./utils");

/**
 * Gets a list of account object from the json account list
 *
 * @returns {object} All of the accounts in the database
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
  const accounts = accs;
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
