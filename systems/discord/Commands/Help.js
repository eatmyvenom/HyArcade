const { MessageEmbed } = require("discord.js");
const Command = require("@hyarcade/structures/Discord/Command");
const CommandResponse = require("@hyarcade/structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

/**
 *
 * @returns {object}
 */
async function helpHandler() {
  const desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Bot-Commands)";

  const embed = new MessageEmbed().setTitle(`${BotRuntime.client.user.username} help`).setDescription(desc).setThumbnail(BotRuntime.client.user.avatarURL()).setColor(0x2f3136);

  return new CommandResponse("", embed);
}

module.exports = new Command("help", ["*"], helpHandler, 0);
