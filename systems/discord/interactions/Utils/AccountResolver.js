const { CommandInteraction } = require("discord.js");
const cfg = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const mojangRequest = require("hyarcade-requests/mojangRequest");
const Account = require("hyarcade-requests/types/Account");
const fetch = require("node-fetch");
const BotRuntime = require("../../BotRuntime");

/**
 * @param {string} string
 * @param {CommandInteraction} interaction
 * @returns {Promise<Account>}
 */
async function getFromHypixel(string, interaction) {
  if (!interaction.deferred) {
    await interaction.deferReply();
  }
  logger.info("Database miss, reading uuid.");

  const plr = string;
  let uuid;
  uuid = plr?.length > 17 ? plr : await mojangRequest.getUUID(plr);

  const acc = new Account("", 0, `${uuid}`);
  await acc.updateData();
  logger.debug(`${acc.uuid} cached`);
  Database.accCache[acc.uuid] = acc;

  if (acc.name == "INVALID-NAME") {
    return;
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
 * @deprecated
 */
module.exports = async function resolveAccount(interaction, namearg = "player", time = "lifetime", force = false) {
  logger.warn("Using deprecated function 'resolveAccount'");
  const str = interaction.options.getString(namearg, false);

  if (BotRuntime.botMode == "mini") {
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

  if (str?.length == 32 || str?.length == 36) {
    if (force && time == "lifetime") return await getFromHypixel(str, interaction);
    urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
  } else if (str.startsWith("<@") || str.startsWith("<!@")) {
    urlArgs.set("discid", str.replace(/[!<>@]/g, ""));
  } else if (str?.length == 18) {
    urlArgs.set("discid", str);
  } else if (str != undefined && str != "null" && str != undefined && str != "!") {
    if (force && time == "lifetime") return await getFromHypixel(str, interaction);
    urlArgs.set("ign", str.toLowerCase());
  } else {
    urlArgs.set("discid", interaction.user.id);
  }

  logger.debug(`Fetching ${url.searchParams.toString()} from database`);
  let accdata = await fetch(url.toString());
  if (accdata.status == 200) {
    accdata = await accdata.json();
    if (time == "lifetime" && (str == undefined || accdata?.name == "INVALID-NAME" || accdata?.name == "null" || accdata?.name == undefined)) {
      return;
    } else if (time != "lifetime" && (accdata?.acc?.name == undefined || accdata?.timed?.name == undefined)) {
      return;
    }
    return accdata;
  }

  if (str != undefined && str != undefined && str != "") {
    return await getFromHypixel(str, interaction);
  }

  return;
};
