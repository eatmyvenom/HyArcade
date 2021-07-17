const Command = require("../../classes/Command");
const { getFromDB } = require("../BotUtils");
const BotUtils = require("../BotUtils");

function safeEval(str) {
    return Function("c", "r", "bu", "accs", "m", '"use strict";return (' + str + ')');
}

module.exports = new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
    let c = BotUtils.client;
    let f = safeEval(args.join(" "));
    return { res : "```\nResponse:\n" + f(c, require, BotUtils, await getFromDB("accounts"), rawMsg) + "\n```"};
});