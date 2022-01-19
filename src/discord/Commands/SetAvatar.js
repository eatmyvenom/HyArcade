const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("setavatar", ["%trusted%"], async (args) => {
  const avatarURL = args[0];
  await BotRuntime.client.user.setAvatar(avatarURL);
  return {
    res: "Avatar updated!"
  };
});
