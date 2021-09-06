const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("UpdateNames", ["%trusted%"], async () => {
  const NameUpdater = await import("../NameUpdater.mjs");
  await NameUpdater.default(BotRuntime.client);
  return {
    res: "Names updated successfully"
  };
});
