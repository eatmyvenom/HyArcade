const logger = require("../Logger");
const cfg = require("../../Config").fromJSON();
const fetch = require('node-fetch');

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

exports.getList = async function getList(type = "") {
    let list;
    let url = new URL("db", cfg.dbUrl);
    let path = `${type}accounts`;
    url.searchParams.set("path", path);
    logger.debug(`Fetching ${url.searchParams.toString()} from database`)

    list = await (await fetch(url)).json();
    return list;
};

exports.stringifyList = function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
    let str = "";
    let size = maxamnt + Number(startingIndex);
    size = size > list.length ? list.length : size;
    list = list.slice(0, size);
    for (let i = startingIndex; i < list.length; i++) {
        // don't print if player has 0 wins
        let propVal = category == undefined ? list[i][lbprop] : list[i][category][lbprop];
        if (numberify(propVal) < 1 && !cfg.printAllWins) continue;

        let name = list[i].name;
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/_/g, "\\_");
};
