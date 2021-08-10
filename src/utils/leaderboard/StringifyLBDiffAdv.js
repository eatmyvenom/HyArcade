const MakeLeaderboardAdv = require("./MakeLeaderboardAdv");
const config = require("../../Config").fromJSON();
const TimSort = require("timsort");

/**
 * @param {string} str
 * @returns {number} The number primitive
 */
function numberify (str) {
  return Number((`${str}`).replace(/undefined/g, 0).replace(/null/g, 0));
}

/**
 * @param {number} number
 * @returns {string} Formatted number
 */
function formatNum (number) {
  return Intl.NumberFormat("en").format(number);
}

module.exports = async function stringLBDiffAdv (comparitor, parser, maxamnt, timetype, callback, listTransformer) {
  let list = await MakeLeaderboardAdv("accounts", timetype, 9999, callback);
  list = await listTransformer(list);
  TimSort.sort(list, comparitor);

  let str = "";
  list = list.slice(0, maxamnt);
  for(let i = 0; i < list.length; i += 1) {
    const propVal = parser(list[i]);
    if(numberify(propVal) < 1 && !config.printAllWins) continue;

    const {name} = list[i];
    str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
  }
  return str.replace(/\\?_/g, "\\_");
};
