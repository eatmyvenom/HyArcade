const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("setusername", ["%trusted%"], async (args) => {
  const username = args.join(" ");
  await BotRuntime.client.user.setUsername(username);

  return new CommandResponse("Username updated!");
});
