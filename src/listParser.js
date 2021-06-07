const Account = require("./account");
const cfg = require("./Config").fromJSON();
const { getKeyByValue } = require("./utils");
const utils = require("./utils");


function getGuild(guildlist, uuid) {
    for(let guild of guildlist) {
        if(guild.memberUUIDs.includes(uuid.toLowerCase())) {
            return guild;
        }
    }
}

/**
 * Gets a list of player objects from the player json list
 *
 * @param {Account[]} acclist
 * @return {Player[]}
 */
exports.players = async function players(acclist) {
    let Player = require("./player")(acclist);

    let playerjson = await utils.readJSON("./playerlist.json");
    let playerlist = [];
    for (let i = 0; i < playerjson.length; i++) {
        playerlist.push(new Player(playerjson[i].name, playerjson[i].accs, 0));
    }
    return playerlist;
};

/**
 * Gets a list of account object from the json account list
 *
 * @return {Object}
 */
exports.accounts = async function accounts() {
    let acclistjson = await utils.readJSON("acclist.json");
    let disclist = await utils.readJSON("disclist.json");
    let guilds = await utils.readJSON("guild.json")
    let acclist = {};

    for (const sublist in acclistjson) {
        let currentlist = [];
        for (const args of acclistjson[sublist]) {
            let acc = new Account(args.name, args.wins, args.uuid);
            let disc = getKeyByValue(disclist, args.uuid);
            let guild = getGuild(guilds, args.uuid);
            acc.discord = disc;
            acc.guildID = guild.uuid;
            acc.guild = guild.name;
            currentlist.push(acc);
        }
        acclist[sublist] = currentlist;
    }
    acclist.accounts = acclist.gamers.concat(acclist.others, acclist.afkers, acclist.important, acclist.yt, acclist.pog);

    if (cfg.mode == "test") {
        acclist.accounts = acclist.gamers;
    }

    return acclist;
};

/**
 * Gets a list of guild objects from the json guild list
 *
 * @param {Account[]} accs
 * @return {Guild[]}
 */
exports.guilds = async function gld(accs) {
    let accounts = accs;
    let Guild = require("./guild")(accounts);
    let guildlistjson = await utils.readJSON("guildlist.json");
    let realList = [];

    for (const guild of guildlistjson) {
        realList.push(new Guild(guild));
    }
    return realList;
};
