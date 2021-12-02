const mojangRequest = require("../../request/mojangRequest");
const logger = require("hyarcade-logger");
const {
  Message
} = require("discord.js");
const Database = require("./Database");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {*} str
 * @returns {string}
 */
function stringify (str) {
  return `${str}`;
}

/**
 * 
 * @param {string} string 
 * @returns {Promise<Account>}
 */
async function getFromHypixel (string) {
  logger.info("Unable to resolve, getting by ign from hypixel.");

  const plr = string;
  let uuid;
  if(plr?.length > 17) {
    uuid = plr;
  } else {
    uuid = await mojangRequest.getUUID(plr);
  }

  let acc;
  if(Database.accCache[uuid] != undefined) {
    acc = Database.accCache[uuid];
  } else {
    acc = new Account("", 0, `${uuid}`);
    await acc.updateData();
    Database.accCache[acc.uuid] = acc;
  }

  if(acc.name == "INVALID-NAME") {
    return undefined;
  }

  await Database.addAccount(acc);
  return acc;
}

/**
 *
 * @param {string} string
 * @param {Message} rawMessage
 * @param {boolean} canbeSelf
 * @param {Account[]} accounts
 * @param {object} disclist
 * @returns {Account}
 */
module.exports = async function resolveAccount (string, rawMessage, canbeSelf, accounts, disclist) {
  logger.info(`Attempting to resolve ${string} from ${rawMessage.content}`);
  const queryString = stringify(string).toLowerCase();


  let acc;
  if(queryString.length == 18) {
    acc = accounts.find((a) => a.discord == queryString);
  }

  if(acc == undefined && queryString.length != 0 && queryString.length > 16) {
    acc = accounts.find((a) => a.uuid?.toLowerCase() == queryString);
  } else if(acc == undefined && queryString.length != 0 && queryString != "undefined" && queryString.length <= 16) {
    acc = accounts.find((a) => a.name?.toLowerCase() == queryString);
  }

  if(acc == undefined) {
    if(rawMessage.mentions.users.size > 0) {
      const discid = `${rawMessage.mentions.users.first()}`;
      const uuid = disclist[discid];
      if(uuid != undefined) {
        acc = accounts.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
      }
    }
  }

  if(acc == undefined && canbeSelf) {
    const discid = rawMessage.author.id;
    const uuid = disclist[discid];
    logger.debug(`Resolved as ${uuid} from discord account list`);
    if(uuid != undefined) {
      acc = accounts.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
    }
  }

  if(acc) {
    logger.info(`resolved as ${acc.name}`);
  } else {
    acc = await getFromHypixel(queryString);
  }
  return acc;
};
