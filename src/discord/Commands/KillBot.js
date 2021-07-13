const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const Webhooks = require("../Utils/Webhooks");

module.exports = new Command("KillBot", ["156952208045375488"], async (args) => {
    await Webhooks.logHook.send("**WARNING** Bot shutdown ordered!");
    await BotUtils.client.destroy();
    process.exit(0);
});
