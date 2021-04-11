const fs = require("fs/promises");
const utils = require("./utils");
const { getUUID } = require("./mojangRequest");
const config = require("./Config").fromJSON();
const { isValidIGN } = require("./utils");
const Account = require("./account");
const logger = utils.logger;

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

        let name = (
            list[i].name.slice(0, 1).toUpperCase() +
            list[i].name.slice(1) +
            "                       "
        ).slice(0, 17);
        //         001) Monkey           : 5900
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

async function listDiffByProp(name, prop, timetype, maxamnt) {
    // cant use require here
    let newlist = await utils.readJSON(`${name}.json`);
    let oldlist = await utils.readJSON(`${name}.${timetype}.json`);

    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let acc;
        if (oldlist[i].uuid) {
            acc = newlist.find(
                (g) => g.uuid.toLowerCase() == oldlist[i].uuid.toLowerCase()
            );
        } else {
            acc = newlist.find(
                (g) => g.name.toLowerCase() == oldlist[i].name.toLowerCase()
            );
        }
        // make sure acc isnt null/undefined
        if (acc) {
            oldlist[i][prop] =
                numberify(acc[prop]) - numberify(oldlist[i][prop]);
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

        if (uuid == undefined) continue;

        if (
            acclist[category].find((acc) => acc.uuid == uuid) ||
            acclist["gamers"].find((acc) => acc.uuid == uuid) ||
            acclist["afkers"].find((acc) => acc.uuid == uuid)
        ) {
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
            newAccs.push({ name: name, wins: wins, uuid: uuid });
            logger.out(`${name} with ${wins} pg wins added.`);
            res += `${name} with ${acc.arcadeWins} wins added.\n`;
        }
    }
    acclist = await utils.readJSON("./acclist.json");
    for (let acc of newAccs) {
        acclist[category].push(acc);
    }
    await utils.writeJSON("./acclist.json", acclist);
    return res;
}

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

async function stringLB(lbprop, maxamnt) {
    let list = await utils.readJSON("./accounts.json");
    list = await [].concat(list).sort((b, a) => {
        return numberify(a[lbprop]) - numberify(b[lbprop]);
    });
    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        // don't print if player has 0 wins
        if (list[i][lbprop] < 1 && !config.printAllWins) continue;

        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or node native for this
        let num = ("000" + (i + 1)).slice(-3);

        let name = (list[i].name + "                       ").slice(0, 17);
        //         001) Monkey           : 5900
        str += `${num}) ${name}: ${list[i][lbprop]}\n`;
    }
    return str;
}

async function stringLBDiff(lbprop, maxamnt, timetype) {
    let list = await listDiffByProp("accounts", lbprop, timetype, 9999);
    list = await [].concat(list).sort((b, a) => {
        return numberify(a[lbprop]) - numberify(b[lbprop]);
    });
    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        // don't print if player has 0 wins
        if (numberify(list[i][lbprop]) < 1 && !config.printAllWins) continue;

        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or node native for this
        let num = ("000" + (i + 1)).slice(-3);

        let name = (
            list[i].name.slice(0, 1).toUpperCase() +
            list[i].name.slice(1) +
            "                       "
        ).slice(0, 17);
        //         001) Monkey           : 5900
        str += `${num}) ${name}: ${list[i][lbprop]}\n`;
    }
    return str;
}

async function stringLBDaily(lbprop, maxamnt) {
    return await stringLBDiff(lbprop, maxamnt, "day");
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
};
