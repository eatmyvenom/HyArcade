const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Database = require("hyarcade-requests/Database");
const Json = require("hyarcade-utils/FileHandling/Json");
const dataGen = require("./datagen/dataGeneration");
const Webhook = require("../src/events/webhook");
const lists = require("../src/listParser");
const { stringNormal, stringDaily } = require("hyarcade-utils/listUtils");

let accounts;

/**
 * @returns {Promise<boolean>}
 */
async function keyFailure() {
  const request = await HypixelApi.key();

  return !request.success;
}

/**
 * Generate the data for all accounts
 *
 * @returns {string[]} files changed by this task
 */
async function accs() {
  if (await keyFailure()) {
    return [];
  }

  accounts = await dataGen.updateAllAccounts();

  await Database.writeDB("accounts", accounts);
  return ["accounts.json"];
}

/**
 * Populate the data for all of the guilds in the guild list
 *
 * @returns {string[]} files changed by this task
 */
async function glds() {
  if (await keyFailure()) {
    return [];
  }

  const guilds = await lists.guilds(accounts);

  let i;
  let j;
  let temparray;

  const chunk = 1;
  for (i = 0, j = guilds.length; i < j; i += chunk) {
    temparray = guilds.slice(i, i + chunk);
    await Promise.all(
      temparray.map(async guild => {
        await guild.updateWins();
        await Database.addGuild(guild);
      }),
    );
  }

  guilds.sort((a, b) => {
    return b.wins - a.wins;
  });
  logger.info(`Saving guild data for ${guilds.length} guilds`);
  await Json.write("guild.json", guilds);
  return ["guild.json"];
}

/**
 * Do all of the stats population tasks
 *
 * @returns {string[]} files changed by this task
 */
async function stats() {
  return await [...(await accs()), ...(await glds())];
}

/**
 * @returns {string[]}
 */
async function addLeaderboards() {
  await dataGen.addLeaderboards();
  return ["accounts.json"];
}

/**
 * Send a webhook message to discord
 *
 * @param {string} type
 * @param {number} maxamnt
 * @returns {string[]} files changed by this task
 */
async function webhook(type, maxamnt) {
  await Webhook.send(await stringNormal(type, maxamnt));
  await Webhook.send(await stringDaily(type, maxamnt));

  return [];
}

/**
 * Run the discord bot
 *
 */
async function discord() {
  const DiscordBot = require("./discord/bot");
  await DiscordBot();
}

module.exports = {
  accounts: accs,
  guilds: glds,
  addLeaderboards,
  stats,
  webhook,
  discord,
};
