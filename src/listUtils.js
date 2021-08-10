const utils = require("./utils");
const config = require("./Config").fromJSON();
const listDiffByProp = require("./utils/leaderboard/LBFromProp");
const {
    stringifyList
} = require("./utils/leaderboard/ListUtils");
const stringLBAdv = require("./utils/leaderboard/StringifyLBAdv");
const stringLBDiffAdv = require("./utils/leaderboard/StringifyLBDiffAdv");
const stringLB = require("./utils/leaderboard/StringifyLB");
const TimSort = require("timsort");

/**
 * Turn a list of anything with wins into formatted text
 *
 * @param {object[]} list the list to format
 * @param {number} maxamnt the maximum index to reach
 * @returns {string} Formatted list
 */
async function txtPlayerList (list, maxamnt) {
    let str = "";
    let len = maxamnt != undefined ? maxamnt : list.length;
    for(let i = 0; i < len; i++) {
        // don't print if player has 0 wins
        if(list[i].wins < 1 && !config.printAllWins) continue;

        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or node native for this
        let num = (`000${i + 1}`).slice(-3);

        let name = (`${list[i].name.slice(0, 1).toUpperCase() + list[i].name.slice(1)}                       `).slice(
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
 * @param {string} name File name
 * @param {number} maxamnt Max amount of players
 * @returns {object[]} Final list
 */
async function listNormal (name, maxamnt) {
    let thelist = await utils.readJSON(`${name}.json`);
    TimSort.sort(thelist, utils.winsSorter);
    thelist = thelist.slice(0, maxamnt);
    return thelist;
}

/**
 * Make a list out of the difference of two json files
 *
 * @param {string} name File name
 * @param {string} timetype Time type as in "day" or "week"
 * @param {number} maxamnt Maximum accounts
 * @returns {object[]} Final list
 */
async function listDiff (name, timetype, maxamnt) {
    return await listDiffByProp(name, "wins", timetype, maxamnt);
}

/**
 * Turn a json file into a formatted list
 *
 * @param {string} name File name
 * @param {number} maxamnt Maximum accounts
 * @returns {string} Stringified list
 */
async function stringNormal (name, maxamnt) {
    let list = await listNormal(name, maxamnt);
    return await txtPlayerList(list);
}

/**
 * Turn the difference of two json files into a formatted list
 *
 * @param {string} name
 * @param {string} timetype
 * @param {number} maxamnt
 * @returns {string} Stringified list
 */
async function stringDiff (name, timetype, maxamnt) {
    let list = await listDiff(name, timetype, maxamnt);
    return await txtPlayerList(list, maxamnt);
}

/**
 * Stringify the daily wins
 *
 * @param {string} name
 * @param {number} maxamnt
 * @returns {string} Stringified list
 */
async function stringDaily (name, maxamnt) {
    return await stringDiff(name, "day", maxamnt);
}

/**
 * 
 * @param {string} lbprop
 * @param {number} maxamnt
 * @param {string} timetype
 * @param {string | undefined} category
 * @param {number} startingIndex
 * @returns {string} Stringified list
 */
async function stringLBDiff (lbprop, maxamnt, timetype, category, startingIndex = 0) {
    let list = await listDiffByProp("accounts", lbprop, timetype, 9999, category);
    if(category == undefined) {
        TimSort.sort(list, (b, a) => {
            return (a[lbprop] ?? 0) - (b[lbprop] ?? 0);
        });
    } else {
        TimSort.sort(list, (b, a) => {
            return (a[category]?.[lbprop] ?? 0) - (b[category]?.[lbprop] ?? 0);
        });
    }

    return stringifyList(list, lbprop, category, maxamnt, startingIndex);
}

/**
 * @param {string} lbprop
 * @param {number} maxamnt
 * @returns {string} Stringified list
 */
async function stringLBDaily (lbprop, maxamnt) {
    return await stringLBDiff(lbprop, maxamnt, "day");
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
