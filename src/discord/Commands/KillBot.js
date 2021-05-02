const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command(
    "KillBot",
    ["156952208045375488"],
    async (args) => {
        await BotUtils.logHook.send("**WARNING** Bot shutdown ordered!");
        await BotUtils.client.destroy();
        process.exit(0);
    }
);
