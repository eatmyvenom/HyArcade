const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Database = require("hyarcade-requests/Database");
const dataGen = require("./datagen/dataGeneration");
const lists = require("hyarcade-utils/listParser");

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
    logger.err("Main key is not functional!");
    return [];
  }

  accounts = await dataGen.updateAllAccounts();
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
  discord,
};
