const utils = require("./utils");
const config = require("./Config").fromJSON();
const BotUtils = require("./discord/BotUtils");
const logger = require("./utils/Logger");

async function getList(type = "") {
    let list;
    if (process.argv[2] != "bot") {
        if (type == "") {
            list = await utils.readJSON("accounts.json");
        } else {
            list = await utils.readJSON(`accounts.${type}.json`);
        }
    } else {
        logger.debug("Getting account data from file cache instead of reading.");
        list = await BotUtils.fileCache[type + "acclist"];
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

        let name = (list[i].name.slice(0, 1).toUpperCase() + list[i].name.slice(1) + "                       ").slice(
            0,
            17
        );
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
        newacc = newlist.find((g) => ("" + g.uuid).toLowerCase() == ("" + oldacc.uuid).toLowerCase());

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

    if(newlist[0].name != oldlist[0].name) {
        logger.debug(newlist[0].name)
        logger.debug(newlist[0].uuid)
        logger.debug(oldlist[0].name)
        logger.debug(oldlist[0].uuid)
        let d = oldlist.find(a=>("" + a.uuid).toLowerCase()==newlist[0].uuid.toLowerCase())
        logger.debug([].concat(oldlist).indexOf(d))
        logger.debug(d.name);
        logger.debug(d.xp)
    }
    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let acc;
        if (oldlist[i].uuid) {
            acc = newlist.find((g) => ("" + g.uuid).toLowerCase() == ("" + oldlist[i].uuid).toLowerCase());
        } else {
            acc = newlist.find((g) => ("" + g.name).toLowerCase() == ("" + oldlist[i].name).toLowerCase());
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

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

async function stringLB(lbprop, maxamnt, category, startingIndex = 0) {
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

    return stringifyList(list, lbprop, category, maxamnt, startingIndex);
}

async function stringLBAdv(comparitor, parser, maxamnt, listTransformer) {
    let list = await getList();
    list = await listTransformer(list);
    list = list.sort(comparitor);

    let str = "";
    list = list.slice(0, maxamnt);
    for (let i = 0; i < list.length; i++) {
        // don't print if player has 0 wins
        let propVal = parser(list[i]);

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
}

async function stringLBDiff(lbprop, maxamnt, timetype, category, startingIndex = 0) {
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

    return stringifyList(list, lbprop, category, maxamnt, startingIndex);
}

async function stringLBDiffAdv(comparitor, parser, maxamnt, timetype, callback, listTransformer) {
    let list = await mklistAdv("accounts", timetype, 9999, callback);
    list = await listTransformer(list);
    list = list.sort(comparitor);

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

function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
    let str = "";
    let size = maxamnt + Number(startingIndex);
    size = size > list.length ? list.length : size;
    list = list.slice(0, size);
    for (let i = startingIndex; i < list.length; i++) {
        // don't print if player has 0 wins
        let propVal = category == undefined ? list[i][lbprop] : list[i][category][lbprop];
        if (numberify(propVal) < 1 && !config.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
}

module.exports = {
    listDiffByProp: listDiffByProp,
    txtPlayerList: txtPlayerList,
    listNormal: listNormal,
    listDiff: listDiff,
    stringNormal: stringNormal,
    stringDiff: stringDiff,
    stringDaily: stringDaily,
    addAccounts: require("./datagen/addAccounts"),
    stringLB: stringLB,
    stringLBDaily: stringLBDaily,
    stringLBDiff: stringLBDiff,
    stringLBAdv: stringLBAdv,
    stringDiffAdv: stringLBDiffAdv,
};
