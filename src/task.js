const Webhook = require("./webhook");
const { stringNormal, stringDaily } = require("./listUtils");
const utils = require("./utils");
const dataGen = require("./dataGeneration");
const DiscordBot = require("./discord/bot");
const EventDetector = require("./EventDetector");

// these modules need to use identical accounts lists so that
// the data does not need to be updated multiple times
let { accounts } = require("./acclist");
const { winsSorter } = require("./utils");
let players = require("./playerlist")(accounts);
let guilds = require("./guildlist")(accounts);

/**
 * Run the generate the data for all accounts
 *
 * @return {String[]} files changed by this task
 */
async function accs() {
    accounts = await dataGen.updateAllAccounts(accounts);
    let old = require("../accounts.json");
    old.sort(winsSorter);
    accounts.sort(winsSorter);
    let ED = new EventDetector(old, accounts);
    await ED.runDetection();
    await ED.logEvents();
    await ED.sendEvents();
    await utils.writeJSON("accounts.json", accounts);
    return ["accounts.json"];
}

/**
 * Populate the data for all of the players in the player list
 *
 * @return {String[]} files changed by this task
 */
async function plrs() {
    await Promise.all(
        players.map(async (player) => {
            await player.updateWins();
        })
    );

    players.sort(utils.winsSorter);
    await utils.writeJSON("players.json", players);
    return ["players.json"];
}

/**
 * Populate the data for all of the guilds in the guild list
 *
 * @return {String[]} files changed by this task
 */
async function glds() {
    await Promise.all(
        guilds.map(async (guild) => {
            await guild.updateWins();
        })
    );

    guilds.sort(utils.winsSorter);
    await utils.writeJSON("guild.json", guilds);
    return ["guild.json"];
}

/**
 * Do all of the stats population tasks
 *
 * @return {String[]} files changed by this task
 */
async function stats() {
    return await [].concat(await accs(), await plrs(), await glds());
}

/**
 * Calculate how many games have been played per player
 *
 * @return {*}
 */
async function gamesPlayed() {
    await dataGen.gamesPlayed();
    return ["gamesPlayed.json"];
}

/**
 * Generate the status for online players
 *
 * @return {String[]} files changed by this task
 */
async function status() {
    await dataGen.genStatus();
    return await ["status.json", "status.txt"];
}

async function statusTxtSorted() {
    await dataGen.statusTxtSorted();
    return await ["status.txt"];
}

/**
 * Send a webhook message to discord
 *
 * @return {String[]} files changed by this task
 */
async function webhook() {
    // send webhook messages, this is only currently
    // in a small server and only does the unofficial
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to
    // another server

    await Webhook.send(await stringNormal(type, maxamnt));
    await Webhook.send(await stringDaily(type, maxamnt));

    return [];
}

/**
 * Run the discord bot
 *
 */
async function discord() {
    await DiscordBot();
}

module.exports = {
    accounts: accs,
    players: plrs,
    guilds: glds,
    gamesPlayed: gamesPlayed,
    stats: stats,
    statusTxtSorted: statusTxtSorted,
    status: status,
    webhook: webhook,
    discord: discord,
};
