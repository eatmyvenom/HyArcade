const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("setpresence", ["%trusted%"], async args => {
  const txt = args.join(" ");
  await BotRuntime.client.user.setPresence({ activities: [{ name: txt, type: "PLAYING" }], status: "online" });

  return new CommandResponse("Presence updated!");
});
