const Account = require("./classes/account");
const cfg = require("./Config").fromJSON();
const guild = require("./classes/guild");
const Player = require("./classes/player");
const {
    getKeyByValue
} = require("./utils");
const utils = require("./utils");

/**
 * 
 * @param {guild[]} guildlist the raw guild list
 * @param {string} uuid the players uuid
 * @returns {guild} The guild of the specified player
 */
function getGuild (guildlist, uuid) {
    for(const guild of guildlist) {
        if(guild.memberUUIDs.includes((`${uuid}`).toLowerCase())) {
            return guild;
        }
    }
}

/**
 * Gets a list of player objects from the player json list
 *
 * @param {Account[]} acclist The preset list of accounts
 * @returns {Player[]} The array of players and their combined data
 */
exports.players = async function players (acclist) {
    const Player = require("./classes/player")(acclist);

    const playerjson = await utils.readJSON("./playerlist.json");
    const playerlist = [];
    for(let i = 0; i < playerjson.length; i += 1) {
        playerlist.push(new Player(playerjson[i].name, playerjson[i].accs, 0));
    }
    return playerlist;
};

/**
 * Gets a list of account object from the json account list
 *
 * @returns {object} All of the accounts in the database
 */
exports.accounts = async function accounts () {
    const acclistjson = await utils.readDB("acclist");
    const disclist = await utils.readDB("disclist");
    const guilds = await utils.readJSON("guild.json");
    const acclist = {};

    for(const sublist in acclistjson) {
        const currentlist = [];
        for(const args of acclistjson[sublist]) {
            const acc = new Account(args.name, args.wins, args.uuid);
            const disc = getKeyByValue(disclist, args.uuid);
            const guild = getGuild(guilds, args.uuid);
            acc.discord = disc;
            if(guild) {
                acc.guildID = guild.uuid;
                acc.guild = guild.name;
                acc.guildTag = guild.tag;
                acc.guildTagColor = guild.color;
            }
            currentlist.push(acc);
        }
        acclist[sublist] = currentlist;
    }
    acclist.accounts = acclist.gamers.concat(
        acclist.others,
        acclist.afkers,
        acclist.important,
        acclist.yt,
        acclist.pog
    );

    if(cfg.mode == "test") {
        acclist.accounts = acclist.gamers;
    }

    return acclist;
};

/**
 * Gets a list of guild objects from the json guild list
 *
 * @param {Account[]} accs Accounts that can be used in these guilds
 * @returns {guild[]} Array of guilds with combined player data
 */
exports.guilds = async function gld (accs) {
    const accounts = accs;
    const Guild = require("./classes/guild")(accounts);
    const guildlistjson = await utils.readJSON("guildlist.json");
    const realList = [];

    for(const guild of guildlistjson) {
        realList.push(new Guild(guild));
    }
    return realList;
};
