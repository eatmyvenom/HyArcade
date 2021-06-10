const fs = require("fs/promises");
const utils = require("./utils");
const { getUUID } = require("./mojangRequest");
const config = require("./Config").fromJSON();
const { isValidIGN } = require("./utils");
const Account = require("./account");
const BotUtils = require("./discord/BotUtils");
const logger = utils.logger;

async function getList(type = "") {
    let list;
    if (process.argv[2] != "bot") {
        if (type == "") {
            list = await utils.readJSON("accounts.json");
        } else {
            list = await utils.readJSON(`accounts.${type}.json`);
        }
    } else {
        list = BotUtils.fileCache[type + "acclist"];
    }
    return list;
}

/**
 * Turn a list of anything with wins into formatted text
 *
 * @param {Object[]} list the list to format
 * @param {Number} maxamnt the maximum index to reach
 * @return {String} Formatted list
 */
async function txtPlayerList(list, maxamnt) {
    let str = "";
    let len = maxamnt != undefined ? maxamnt : list.length;
    for (let i = 0; i < len; i++) {
        // don't print if player has 0 wins
        if (list[i].wins < 1 && !config.printAllWins) continue;

        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or node native for this
        let num = ("000" + (i + 1)).slice(-3);

        let name = (list[i].name.slice(0, 1).toUpperCase() + list[i].name.slice(1) + "                       ").slice(0, 17);
        //         001) MonkeyCity17     : 5900
        str += `${num}) ${name}: ${list[i].wins}\n`;
    }
    return str;
}

/**
 * Make a list out of a json file
 *
 * @param {String} name
 * @param {Number} maxamnt
 * @return {Object[]}
 */
async function listNormal(name, maxamnt) {
    let thelist = await utils.readJSON(`${name}.json`);
    thelist.sort(utils.winsSorter);
    thelist = thelist.slice(0, maxamnt);
    return thelist;
}

function findMatchingAccount(acc, list) {
    return list.find((a) => a.uuid.toLowerCase() == acc.uuid.toLowerCase());
}

/**
 * Make a list out of the difference of two json files
 *
 * @param {String} name
 * @param {String} timetype
 * @param {Number} maxamnt
 * @return {Object[]}
 */
async function listDiff(name, timetype, maxamnt) {
    return await listDiffByProp(name, "wins", timetype, maxamnt);
}

/**
 * 
 * @param {String} name 
 * @param {String} timetype 
 * @param {Number} maxamnt Max amount of players in 
 * @param {Function} callback Callback used to get the stats out of each account
 * @returns 
 */
async function mklistAdv(name, timetype, maxamnt, callback) {
    let newlist, oldlist;
    if (name == "accounts") {
        newlist = await getList();
        oldlist = await getList(timetype);
    } else {
        newlist = await utils.readJSON(`${name}.json`);
        oldlist = await utils.readJSON(`${name}.${timetype}.json`);
    }
    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let oldacc = oldlist[i];
        let newacc;
        newacc = newlist.find((g) => g.uuid.toLowerCase() == oldacc.uuid.toLowerCase());
        
        // make sure acc isnt null/undefined
        if (newacc) {
            oldlist[i] = callback(newacc, oldacc);
        }
    }

    // use old list to ensure that players added today
    // don't show up with a crazy amount of daily wins
    return oldlist.slice(0, maxamnt);
}

async function listDiffByProp(name, prop, timetype, maxamnt, category) {
    let newlist, oldlist;
    if (name == "accounts") {
        newlist = await getList();
        oldlist = await getList(timetype);
    } else {
        newlist = await utils.readJSON(`${name}.json`);
        oldlist = await utils.readJSON(`${name}.${timetype}.json`);
    }

    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let acc;
        if (oldlist[i].uuid) {
            acc = newlist.find((g) => g.uuid.toLowerCase() == oldlist[i].uuid.toLowerCase());
        } else {
            acc = newlist.find((g) => g.name.toLowerCase() == oldlist[i].name.toLowerCase());
        }

        if (category == undefined) {
            // make sure acc isnt null/undefined
            if (acc) {
                oldlist[i][prop] = numberify(acc[prop]) - numberify(oldlist[i][prop]);
            }
        } else {
            // make sure acc isnt null/undefined
            if (acc) {
                oldlist[i][category][prop] = numberify(acc[category][prop]) - numberify(oldlist[i][category][prop]);
            }
        }
    }

    // use old list to ensure that players added today
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(utils.winsSorter);
    return oldlist.slice(0, maxamnt);
}

/**
 * Turn a json file into a formatted list
 *
 * @param {String} name
 * @param {Number} maxamnt
 * @return {String}
 */
async function stringNormal(name, maxamnt) {
    let list = await listNormal(name, maxamnt);
    return await txtPlayerList(list);
}

/**
 * Turn the difference of two json files into a formatted list
 *
 * @param {String} name
 * @param {String} timetype
 * @param {Number} maxamnt
 * @return {String}
 */
async function stringDiff(name, timetype, maxamnt) {
    let list = await listDiff(name, timetype, maxamnt);
    return await txtPlayerList(list, maxamnt);
}

/**
 * Stringify the daily wins
 *
 * @param {String} name
 * @param {Number} maxamnt
 * @return {String}
 */
async function stringDaily(name, maxamnt) {
    return await stringDiff(name, "day", maxamnt);
}

/**
 * Add a list of accounts to another list
 *
 * @param {String} category
 * @param {String[]} names
 * @return {null}
 */
async function addAccounts(category, names) {
    let res = "";
    let acclist = await utils.readJSON("./acclist.json");
    let newAccs = [];
    if (acclist[category] == undefined) {
        logger.err("Please input a valid category!");
        return "Please input a valid category!";
    }
    let nameArr = names;
    for (let name of nameArr) {
        let uuid;
        if (name.length == 32 || name.length == 36) {
            uuid = name.replace(/-/g, "");
        } else {
            if (!isValidIGN(name)) {
                logger.err(`${name} is not a valid IGN!`);
                res += `${name} is not a valid IGN!\n`;
                continue;
            }
            uuid = await getUUID(name);
        }

        if (uuid == undefined) {
            res += `${name} does not exist!\n`;
            continue;
        }

        if (acclist[category].find((acc) => acc.uuid == uuid) || acclist["gamers"].find((acc) => acc.uuid == uuid) || acclist["afkers"].find((acc) => acc.uuid == uuid)) {
            logger.err(`Refusing to add duplicate! (${name})`);
            res += `Refusing to add duplicate! (${name})\n`;
            continue;
        }

        let acc = new Account("", 0, uuid);
        await acc.updateHypixel();
        let wins = acc.wins;
        name = acc.name;

        if (wins < 50 && category == "gamers") {
            logger.err("Refusing to add account with under 50 wins to gamers!");
        } else {
            newAccs.push(acc);
            logger.out(`${name} with ${wins} pg wins added.`);
            res += `${name} with ${acc.arcadeWins} wins added.\n`;
        }
    }
    let oldAccounts = await utils.readJSON("accounts.json");
    let fullNewAccounts = oldAccounts.concat(newAccs);
    acclist = await utils.readJSON("./acclist.json");
    for (let acc of newAccs) {
        let lilAcc = { name: acc.name, wins: acc.wins, uuid: acc.uuid };
        acclist[category].push(lilAcc);
    }
    await utils.writeJSON("acclist.json", acclist);
    await utils.writeJSON("accounts.json", fullNewAccounts);
    await utils.writeJSON("accounts.json.part", newAccs);
    return res;
}

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

async function stringLB(lbprop, maxamnt, category) {
    let list = await getList();
    if (category == undefined) {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[lbprop]) - numberify(b[lbprop]);
        });
    } else {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[category][lbprop]) - numberify(b[category][lbprop]);
        });
    }

    return stringifyList(list, lbprop, category, maxamnt);
}

async function stringLBAdv(comparitor, parser, maxamnt, excludedUUIDs) {
    let list = await getList();
    list = list.sort(comparitor);
    list = list.filter(a => !excludedUUIDs.includes(a.uuid));

    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        // don't print if player has 0 wins
        let propVal = parser(list[i]);
        if (propVal < 1 && !config.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
}

async function stringLBDiff(lbprop, maxamnt, timetype, category) {
    let list = await listDiffByProp("accounts", lbprop, timetype, 9999, category);
    if (category == undefined) {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[lbprop]) - numberify(b[lbprop]);
        });
    } else {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[category][lbprop]) - numberify(b[category][lbprop]);
        });
    }

    return stringifyList(list, lbprop, category, maxamnt);
}

async function stringLBDiffAdv(comparitor, parser, maxamnt, timetype, callback, excludedUUIDs) {
    let list = await mklistAdv("accounts", timetype, 9999, callback);
    list = list.sort(comparitor);
    list = list.filter(a => !excludedUUIDs.includes(a.uuid));

    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        let propVal = parser(list[i]);
        if (numberify(propVal) < 1 && !config.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
}

async function stringLBDaily(lbprop, maxamnt) {
    return await stringLBDiff(lbprop, maxamnt, "day");
}

function stringifyList(list, lbprop, category, maxamnt) {
    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        // don't print if player has 0 wins
        let propVal = category == undefined ? list[i][lbprop] : list[i][category][lbprop];
        if (numberify(propVal) < 1 && !config.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
}

module.exports = {
    txtPlayerList: txtPlayerList,
    listNormal: listNormal,
    listDiff: listDiff,
    stringNormal: stringNormal,
    stringDiff: stringDiff,
    stringDaily: stringDaily,
    addAccounts: addAccounts,
    stringLB: stringLB,
    stringLBDaily: stringLBDaily,
    stringLBDiff: stringLBDiff,
    stringLBAdv: stringLBAdv,
    stringDiffAdv: stringLBDiffAdv,
};
