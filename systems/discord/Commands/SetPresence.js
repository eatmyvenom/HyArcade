const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");

module.exports = new Command("setpresence", ["%trusted%"], async (args) => {
  const txt = args.join(" ");
  await BotRuntime.client.user.setPresence({ activities: [{ name: txt, type: "PLAYING" }], status: "online" });

  return new CommandResponse("Presence updated!");
});
