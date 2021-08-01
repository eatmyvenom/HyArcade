const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("ez", ["*"], async () => {
    let msgs = await BotUtils.getFromDB("ezmsgs");
    let msg = msgs[Math.floor(Math.random() * msgs.length)];
    msg = msg.replace(/\\n/g, "\n");
    return {
        res: msg
    };
});
