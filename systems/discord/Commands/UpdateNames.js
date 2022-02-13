const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("updatenames", ["%trusted%"], async () => {
  const NameUpdater = await import("../Utils/MemberHandlers/NameUpdater.mjs");
  await NameUpdater.default(BotRuntime.client);
  return {
    res: "Names updated successfully",
  };
});
