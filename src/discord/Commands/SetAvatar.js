const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("SetAvatar", ["%trusted%"], async (args) => {
  const avatarURL = args[0];
  await BotRuntime.client.user.setAvatar(avatarURL);
  return {
    res: "Avatar updated!"
  };
});
