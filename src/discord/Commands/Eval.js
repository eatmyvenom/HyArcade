const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

function safeEval(str) {
    return Function('"use strict";return (' + str + ')');
}

module.exports = new Command("eval", ["156952208045375488"], async (args) => {
    let c = BotUtils.client;
    let f = safeEval(args.join(" "));
    return { res : f()};
});