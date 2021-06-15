const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("ez", ["*"], async (args) => {
    let msgs = await BotUtils.fileCache.ezmsgs;
    let msg = msgs[(Math.floor(Math.random() * msgs.length))];
    return { res : msg };
});
