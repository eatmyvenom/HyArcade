const Command = require("@hyarcade/structures/Discord/Command");
const CommandResponse = require("@hyarcade/structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("setusername", ["%trusted%"], async args => {
  const username = args.join(" ");
  await BotRuntime.client.user.setUsername(username);

  return new CommandResponse("Username updated!");
});
