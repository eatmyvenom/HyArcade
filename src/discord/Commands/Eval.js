const Command = require("../../classes/Command");
const {
    getFromDB
} = require("../BotUtils");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");
const Util = require("util");

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval (str) {
    return Function("c", "r", "bu", "accs", "m", `"use strict";return (${str})`);
}

module.exports = new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
    const c = BotUtils.client;
    const f = safeEval(args.join(" "));
    let evaled = f(c, require, BotUtils, await getFromDB("accounts"), rawMsg);
    if(typeof evaled != "string") {
        evaled = Util.inspect(evaled, true);
    }
    const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
    return new CommandResponse(res);
});
