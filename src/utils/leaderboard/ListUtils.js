const BotUtils = require("../../discord/BotUtils");
const logger = require("../Logger");

exports.getList = async function getList(type = "") {
    let list;
    if (process.argv[2] != "bot") {
        if (type == "") {
            list = await utils.readJSON("accounts.json");
        } else {
            list = await utils.readJSON(`accounts.${type}.json`);
        }
    } else {
        logger.debug("Getting account data from file cache instead of reading.");

        // Use json to make a full depth copy of the list in its current state
        let copylist = JSON.parse(JSON.stringify(BotUtils.fileCache[type + "acclist"]));
        list = copylist;
    }
    return list;
}

exports.stringifyList = function stringifyList(list, lbprop, category, maxamnt, startingIndex = 0) {
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