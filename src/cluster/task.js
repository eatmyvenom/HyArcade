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
const {
    winsSorter, logger
} = require("../utils");

/**
 * Generate the data for all accounts
 *
 * @returns {string[]} files changed by this task
 */
async function accs() {
    let acclist = await lists.accounts();
    accounts = await dataGen.updateAllAccounts(acclist);
    let old = await utils.readDB("accounts");
    old.sort(winsSorter);
    accounts.sort(winsSorter);

    try {
        if(!config.clusters[config.cluster].flags.includes("ignoreEvents")) {
            let ED = new EventDetector(old, accounts);
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
 * Populate the data for all of the players in the player list
 *
 * @returns {string[]} files changed by this task
 */
async function plrs() {
    let players = await lists.players(accounts);
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
 * @returns {string[]} files changed by this task
 */
async function glds() {
    let guilds = await lists.guilds(accounts);
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
 * @returns {string[]} files changed by this task
 */
async function stats() {
    return await [].concat(await accs(), await plrs(), await glds());
}

/**
 * Calculate how many games have been played per player
 *
 * @returns {*}
 */
async function gamesPlayed() {
    await dataGen.gamesPlayed();
    return ["gamesPlayed.json"];
}

/**
 * @returns {string[]}
 */
async function addLeaderboards() {
    await dataGen.addLeaderboards();
    return ["acclist.json"];
}

/**
 * Generate the status for online players
 *
 * @returns {string[]} files changed by this task
 */
async function status() {
    await dataGen.genStatus();
    return await ["status.json", "status.txt"];
}

/**
 * @returns {string[]}
 */
async function statusTxtSorted() {
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
    const DiscordBot = require("../discord/bot");
    await DiscordBot();
}

module.exports = {
    accounts: accs,
    players: plrs,
    guilds: glds,
    gamesPlayed: gamesPlayed,
    addLeaderboards: addLeaderboards,
    stats: stats,
    statusTxtSorted: statusTxtSorted,
    status: status,
    webhook: webhook,
    discord: discord,
};
