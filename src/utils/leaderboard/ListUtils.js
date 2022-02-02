const cfg = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const fetch = require("node-fetch");

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
  const url = new URL("db", cfg.dbUrl);
  const path = `${type}accounts`;
  url.searchParams.set("path", path);
  logger.debug(`Fetching ${url.searchParams.toString()} from database`);

  const list = await (await fetch(url, { method: "get", headers: { Authorization: cfg.dbPass } })).json();
  logger.debug("Data fetched!");
  return AccountArray(list);
};

exports.stringifyList = function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
  let str = "";
  let size = maxamnt + (startingIndex | 0);
  size = size > list.length ? list.length : size;
  const sizedList = list.slice(0, size);

  let propVal;
  for (let i = startingIndex; i < sizedList.length; i += 1) {
    propVal = category == undefined ? sizedList[i]?.[lbprop] : sizedList[i]?.[category]?.[lbprop];
    // don't print if player has 0 wins
    if (!((propVal ?? 0) > 0) && !cfg.printAllWins) continue;

    const { name } = sizedList[i];

    // eslint-disable-next-line prefer-template
    const num = `\` ${i + 1}`.padEnd(`\` ${sizedList.length} `.length) + "`";

    str += `${num} **${name}** (\`${formatNum(propVal ?? 0)}\`)\n`;
  }
  return str.replace(/\\?_/g, "\\_");
};
