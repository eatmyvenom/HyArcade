const config = require("hyarcade-config").fromJSON();
const TimSort = require("timsort");
const MakeLeaderboardAdv = require("./MakeLeaderboardAdv");

/**
 * @param {string} str
 * @returns {number} The number primitive
 */
function numberify(str) {
  return Number(`${str}`.replace(/undefined/g, 0).replace(/null/g, 0));
}

/**
 * @param {number} number
 * @returns {string} Formatted number
 */
function formatNum(number) {
  return Intl.NumberFormat("en").format(number);
}

module.exports = async function stringLBDiffAdv(comparitor, parser, maxamnt, timetype, callback, listTransformer) {
  let list = await MakeLeaderboardAdv("accounts", timetype, 9999, callback);
  list = await listTransformer(list);
  TimSort.sort(list, comparitor);

  let str = "";
  list = list.slice(0, maxamnt);
  for (const [i, listItem] of list.entries()) {
    const propVal = parser(listItem);
    if (numberify(propVal) < 1 && !config.printAllWins) continue;

    const { name } = listItem;
    str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
  }
  return str.replace(/\\?_/g, "\\_");
};
