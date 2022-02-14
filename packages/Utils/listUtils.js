const config = require("hyarcade-config").fromJSON();
const Json = require("hyarcade-utils/FileHandling/Json");
const TimSort = require("timsort");
const listDiffByProp = require("./Leaderboards/LBFromProp");
const { stringifyList } = require("./Leaderboards/ListUtils");
const stringLB = require("./Leaderboards/StringifyLB");
const stringLBAdv = require("./Leaderboards/StringifyLBAdv");
const stringLBDiffAdv = require("./Leaderboards/StringifyLBDiffAdv");

/**
 * Turn a list of anything with wins into formatted text
 *
 * @param {object[]} list the list to format
 * @param {number} maxamnt the maximum index to reach
 * @returns {string} Formatted list
 */
async function txtPlayerList(list, maxamnt) {
  let str = "";
  const len = maxamnt != undefined ? maxamnt : list.length;
  for (let i = 0; i < len; i += 1) {
    // don't print if player has 0 wins
    if (list[i].wins < 1 && !config.printAllWins) continue;

    // this hack is because js has no real string formatting and its
    // not worth it to use wasm or node native for this
    const num = `000${i + 1}`.slice(-3);

    const name = `${list[i].name.slice(0, 1).toUpperCase() + list[i].name.slice(1)}                       `.slice(0, 17);
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
async function listNormal(name, maxamnt) {
  let thelist = await Json.read(`${name}.json`);
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
async function listDiff(name, timetype, maxamnt) {
  return await listDiffByProp(name, "wins", timetype, maxamnt);
}

/**
 * Turn a json file into a formatted list
 *
 * @param {string} name File name
 * @param {number} maxamnt Maximum accounts
 * @returns {string} Stringified list
 */
async function stringNormal(name, maxamnt) {
  const list = await listNormal(name, maxamnt);
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
async function stringDiff(name, timetype, maxamnt) {
  const list = await listDiff(name, timetype, maxamnt);
  return await txtPlayerList(list, maxamnt);
}

/**
 * Stringify the daily wins
 *
 * @param {string} name
 * @param {number} maxamnt
 * @returns {string} Stringified list
 */
async function stringDaily(name, maxamnt) {
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
async function stringLBDiff(lbprop, maxamnt, timetype, category, startingIndex = 0) {
  const list = await listDiffByProp("accounts", lbprop, timetype, 9999, category);
  if (category == undefined) {
    TimSort.sort(list, (b, a) => (a[lbprop] ?? 0) - (b[lbprop] ?? 0));
  } else {
    TimSort.sort(list, (b, a) => (a[category]?.[lbprop] ?? 0) - (b[category]?.[lbprop] ?? 0));
  }

  return stringifyList(list, lbprop, category, maxamnt, startingIndex);
}

/**
 * @param {string} lbprop
 * @param {number} maxamnt
 * @returns {string} Stringified list
 */
async function stringLBDaily(lbprop, maxamnt) {
  return await stringLBDiff(lbprop, maxamnt, "day");
}

module.exports = {
  listDiffByProp,
  txtPlayerList,
  listNormal,
  listDiff,
  stringNormal,
  stringDiff,
  stringDaily,
  addAccounts: require("../../systems/datagen/addAccounts"),
  stringLB,
  stringLBDaily,
  stringLBDiff,
  stringLBAdv,
  stringDiffAdv: stringLBDiffAdv,
};
