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