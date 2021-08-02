const logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const cfg = require("../../Config").fromJSON();
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
    let list;
    let url = new URL("db", cfg.dbUrl);
    let path = `${type}accounts`;
    url.searchParams.set("path", path);
    logger.debug(`Fetching ${url.searchParams.toString()} from database`);

    list = await (await fetch(url)).json();
    logger.debug("Data fetched!");
    return list;
};

exports.stringifyList = function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
    let str = "";
    let size = maxamnt + (startingIndex | 0);
    size = size > list.length ? list.length : size;
    list = list.slice(0, size);

    let propVal;
    for(let i = startingIndex; i < list.length; i++) {

        propVal = category == undefined ? list[i]?.[lbprop] : list[i]?.[category]?.[lbprop];
        // don't print if player has 0 wins
        if((propVal | 0) < 1 && !cfg.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
};
