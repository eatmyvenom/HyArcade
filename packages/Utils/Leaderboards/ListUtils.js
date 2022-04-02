const cfg = require("@hyarcade/config").fromJSON();
const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");
const logger = require("@hyarcade/logger");
const { Account, AccountArray } = require("@hyarcade/structures");

/**
 * @param {number} number
 * @returns {string} Formatted number
 */
function formatNum(number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 *
 * @param {string} type
 * @returns {Promise<Account>} Account list
 */
exports.getList = async function getList(type = "") {
  Logger.warn("YOU SHOULD NOT BE HERE!");
  const url = new URL("database", cfg.database.url);
  const path = `${type}accounts`;
  url.searchParams.set("path", path);
  logger.debug(`Fetching ${url.searchParams.toString()} from database`);

  const listFetch = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass } });
  const list = listFetch.data;
  logger.debug("Data fetched!");
  return AccountArray(list);
};

exports.stringifyList = function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
  let str = "";
  let size = maxamnt + startingIndex;
  size = size > list.length ? list.length : size;
  const sizedList = list.slice(0, size);

  let propVal;
  for (let i = startingIndex; i < sizedList.length; i += 1) {
    propVal = category == undefined ? sizedList[i]?.[lbprop] : sizedList[i]?.[category]?.[lbprop];
    if (!((propVal ?? 0) > 0) && !cfg.printAllWins) continue;

    const name = `**${sizedList[i].name}**`;

    // eslint-disable-next-line prefer-template
    const num = `\` ${i + 1}`.padEnd(`\` ${sizedList.length} `.length) + "`";

    str += `${num} ${name} (\`${formatNum(propVal ?? 0)}\`)\n`;
  }
  return str.replace(/\\?_/g, "\\_");
};
