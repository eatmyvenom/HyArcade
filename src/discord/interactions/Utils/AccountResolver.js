const fetch = require("node-fetch");
const logger = require("hyarcade-logger");
const mojangRequest = require("../../../request/mojangRequest");
const BotRuntime = require("../../BotRuntime");
const {
  CommandInteraction
} = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const Database = require("../../Utils/Database");
const cfg = require("hyarcade-config").fromJSON();

/**
 * @param {string} string
 * @param {CommandInteraction} interaction
 * @returns {Promise<Account>}
 */
async function getFromHypixel (string, interaction) {
  if(!interaction.deferred) {
    await interaction.defer();
  }
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

  return acc;
}

/**
 *
 * @param {CommandInteraction} interaction
 * @param {string} namearg
 * @param {string} time
 * @returns {Promise<Account>}
 */
module.exports = async function resolveAccount (interaction, namearg = "player", time = "lifetime") {
  const str = interaction.options.getString(namearg, false);
  if(BotRuntime.botMode == "mini") {
    return await getFromHypixel(str, interaction);
  }

  let url;
  if (time != "lifetime") {
    url = new URL("timeacc", cfg.dbUrl);
  } else {
    url = new URL("account", cfg.dbUrl);
  }

  const urlArgs = url.searchParams;

  if(str?.length == 32) {
    urlArgs.set("uuid", str.toLowerCase());
  } else if(str?.length == 36) {
    urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
  } else if(str?.length == 21 && str.startsWith("<@")) {
    urlArgs.set("discid", str.slice(2, -1));
  } else if(str?.length == 22 && str.startsWith("<!@")) {
    urlArgs.set("discid", str.slice(3, -1));
  } else if(str?.length == 18 && str.toUpperCase() == str.toLowerCase()) {
    urlArgs.set("discid", str);
  } else if(str != null && str != "null" && str != undefined && str != "!") {
    urlArgs.set("ign", str.toLowerCase());
  } else {
    urlArgs.set("discid", interaction.user.id);
  }

  if (time != "lifetime") {
    urlArgs.set("time", time);
  }

  logger.debug(`Fetching ${url.searchParams.toString()} from database`);
  let accdata = await fetch(url.toString());
  if(accdata.status == 200) {
    accdata = await accdata.json();
    if(str == undefined || accdata.name == "INVALID-NAME" || accdata.name == "null") {
      return undefined;
    }
    return accdata;
  }

  if(str != null && str != undefined && str != "") {
    return await getFromHypixel(str, interaction);
  }

  return undefined;

};
