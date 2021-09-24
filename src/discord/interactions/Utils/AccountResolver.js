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
  logger.info("Database miss, reading uuid.");

  const plr = string;
  let uuid;
  if(plr?.length > 17) {
    uuid = plr;
  } else {
    uuid = await mojangRequest.getUUID(plr);
  }

  let acc;
  if(Database.accCache[uuid] != undefined) {
    logger.info("Cache hit, returning cached version.");
    acc = Database.accCache[uuid];
  } else {
    logger.info("Cache miss, querying from hypixel.");
    acc = new Account("", 0, `${uuid}`);
    await acc.updateData();
    logger.debug(`${acc.uuid} cached`);
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
 * @param {CommandInteraction} interaction
 * @param {string} namearg
 * @param {string} time
 * @param {boolean} force
 * @returns {Promise<Account>}
 */
module.exports = async function resolveAccount (interaction, namearg = "player", time = "lifetime", force = false) {
  const str = interaction.options.getString(namearg, false);

  if(BotRuntime.botMode == "mini") {
    return await getFromHypixel(str, interaction);
  }

  let url;
  let urlArgs;
  if (time != "lifetime") {
    url = new URL("timeacc", cfg.dbUrl);

    urlArgs = url.searchParams;
    urlArgs.set("time", time);
  } else {
    url = new URL("account", cfg.dbUrl);

    urlArgs = url.searchParams;
  }

  if(str?.length == 32 || str?.length == 36) {
    if (force && time == "lifetime") return await getFromHypixel(str, interaction);
    urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
  } else if(str.startsWith("<@") || str.startsWith("<!@")) {
    urlArgs.set("discid", str.replace(/<|@|!|>/g, ""));
  } else if(str?.length == 18) {
    urlArgs.set("discid", str);
  } else if(str != null && str != "null" && str != undefined && str != "!") {
    if (force && time == "lifetime") return await getFromHypixel(str, interaction);
    urlArgs.set("ign", str.toLowerCase());
  } else {
    urlArgs.set("discid", interaction.user.id);
  }

  logger.debug(`Fetching ${url.searchParams.toString()} from database`);
  let accdata = await fetch(url.toString());
  if(accdata.status == 200) {
    accdata = await accdata.json();
    if(time == "lifetime" && (str == undefined || accdata?.name == "INVALID-NAME" || accdata?.name == "null" || accdata?.name == undefined)) {
      return undefined;
    } else if (time != "lifetime" && (accdata?.acc?.name == undefined || accdata?.timed?.name == undefined)) {
      return undefined;
    }
    return accdata;
  }

  if(str != null && str != undefined && str != "") {
    return await getFromHypixel(str, interaction);
  }

  return undefined;
};
