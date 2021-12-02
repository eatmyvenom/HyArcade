const Webhook = require("../events/webhook");
const {
  stringNormal,
  stringDaily
} = require("../listUtils");
const utils = require("../utils");
const config = require("../Config").fromJSON();
const dataGen = require("../dataGeneration");
const EventDetector = require("../events/EventDetector");

const lists = require("../listParser");
let accounts = [];
const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const NormalizeAccount = require("../datagen/utils/NormalizeAccount");

/**
 * 
 * @param {*} b 
 * @param {*} a 
 * @returns {number}
 */
function accSorter (b, a) {
  return NormalizeAccount(a) - NormalizeAccount(b);
}

/**
 * Generate the data for all accounts
 *
 * @returns {string[]} files changed by this task
 */
async function accs () {

  if(!(await HypixelApi.key()).success) {
    return [];
  }

  accounts = await dataGen.updateAllAccounts();
  const old = await utils.readDB("accounts");
  old.sort(accSorter);
  accounts.sort(accSorter);

  try {
    if(!config.clusters[config.cluster].flags.includes("ignoreEvents")) {
      const ED = new EventDetector(old, accounts);
      await ED.runDetection();
      await ED.logEvents();
      await ED.sendEvents();
      await ED.saveEvents();
    }
  } catch (e) {
    logger.err(e);
  }

  await utils.writeDB("accounts", accounts);
  return ["accounts.json"];
}

/**
 * Populate the data for all of the guilds in the guild list
 *
 * @returns {string[]} files changed by this task
 */
async function glds () {
  if(!(await HypixelApi.key()).success) {
    return [];
  }

  const guilds = await lists.guilds(accounts);

  let i;
  let j;
  let temparray;

  const chunk = 120;
  for(i = 0, j = guilds.length; i < j; i += chunk) {
    temparray = guilds.slice(i, i + chunk);
    await Promise.all(
      temparray.map(async (guild) => {
        await guild.updateWins();
      })
    );
  }

  guilds.sort(utils.winsSorter);
  logger.info(`Saving guild data for ${guilds.length} guilds`);
  await utils.writeJSON("guild.json", guilds);
  return ["guild.json"];
}

/**
 * Do all of the stats population tasks
 *
 * @returns {string[]} files changed by this task
 */
async function stats () {
  return await [].concat(await accs(), await glds());
}

/**
 * Calculate how many games have been played per player
 *
 * @returns {*}
 */
async function gamesPlayed () {
  await dataGen.gamesPlayed();
  return ["gamesPlayed.json"];
}

/**
 * @returns {string[]}
 */
async function addLeaderboards () {
  await dataGen.addLeaderboards();
  return ["accounts.json"];
}

/**
 * Generate the status for online players
 *
 * @returns {string[]} files changed by this task
 */
async function status () {
  await dataGen.genStatus();
  return await ["status.json", "status.txt"];
}

/**
 * @returns {string[]}
 */
async function statusTxtSorted () {
  await dataGen.statusTxtSorted();
  return await ["status.txt"];
}

/**
 * Send a webhook message to discord
 *
 * @param {string} type
 * @param {number} maxamnt
 * @returns {string[]} files changed by this task
 */
async function webhook (type, maxamnt) {
  await Webhook.send(await stringNormal(type, maxamnt));
  await Webhook.send(await stringDaily(type, maxamnt));

  return [];
}

/**
 * Run the discord bot
 *
 */
async function discord () {
  const DiscordBot = require("../discord/bot");
  await DiscordBot();
}

module.exports = {
  accounts: accs,
  guilds: glds,
  gamesPlayed,
  addLeaderboards,
  stats,
  statusTxtSorted,
  status,
  webhook,
  discord,
};
