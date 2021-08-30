const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("SetUsername", ["%trusted%"], async (args) => {
  const username = args.join(" ");
  await BotRuntime.client.user.setUsername(username);
  return {
    res: "Username updated!"
  };
});
