const Command = require("../../classes/Command");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg);
    let path = args[args.length - 1];
    let res = acc.name + "." + path + " : " + acc[path];
    return { res : res };
});