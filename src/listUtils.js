const utils = require("./utils");
const config = require("./Config").fromJSON();
const listDiffByProp = require('./utils/leaderboard/LBFromProp');
const { getList } = require("./utils/leaderboard/ListUtils");
const mklistAdv = require('./utils/leaderboard/MakeLeaderboardAdv');

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
