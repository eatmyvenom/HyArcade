const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

/**
 * 
 * @returns {object}
 */
async function helpHandler () {
  let desc = "";
  if(BotRuntime.botMode == "mini") {
    desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Commands)";
  } else {
    desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Bot-Commands)";
  }

  const embed = new MessageEmbed()
    .setTitle(`${BotRuntime.client.user.username} help`)
    .setDescription(desc)
    .setThumbnail(BotRuntime.client.user.avatarURL())
    .setColor(0x2f3136);
  return {
    res: "",
    embed
  };
}

module.exports = new Command("help", ["*"], helpHandler, 0);
