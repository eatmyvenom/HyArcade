const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("SetPresence", ["%trusted%"], async (args) => {
  const presenceObj = JSON.parse(args.join(" "));
  await BotRuntime.client.user.setPresence(presenceObj);
  return {
    res: "Presence updated!"
  };
});
