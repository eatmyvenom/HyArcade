const Command = require("../../classes/Command");
const process = require("process");
const BotUtils = require("../BotUtils");
const Webhooks = require("../Utils/Webhooks");

module.exports = new Command("KillBot", ["156952208045375488"], async () => {
  await Webhooks.logHook.send("**WARNING** Bot shutdown ordered!");
  await BotUtils.client.destroy();
  process.exit(0);
});
