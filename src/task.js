const Webhook = require("./webhook");
const {
    listNormal,
    listDiff,
    stringNormal,
    stringDaily,
} = require("./listUtils");
const utils = require("./utils");
const dataGen = require("./dataGeneration");

// these modules need to use identical accounts lists so that
// the data does not need to be updated multiple times
let { accounts } = require("./acclist");
let players = require("./playerlist")(accounts);
let guilds = require("./guildlist")(accounts);

async function accs() {
    accounts = await dataGen.updateAllAccounts(accounts);
    await utils.writeJSON("accounts.json", accounts);
    return ["accounts.json"];
}

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

async function stats() {
    return await [].concat(await accs(), await plrs(), await glds());
}

async function status() {
    await dataGen.genStatus();
    return ["status.json", "status.txt"];
}

async function discord() {
    // send webhook messages, this is only currently
    // in a small server and only does the unofficial
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to
    // another server

    await Webhook.send(await stringNormal(type, maxamnt));
    await Webhook.send(await stringDaily(type, maxamnt));

    return [];
}

module.exports = {
    accounts: accs,
    players: plrs,
    guilds: glds,
    stats: stats,
    status: status,
    discord: discord,
};
