import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { MessageEmbed } = require("discord.js");
const { client } = require("../BotRuntime.js");

/**
 *
 * @returns {object}
 */
async function helpHandler() {
  const desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Bot-Commands)";

  const embed = new MessageEmbed()
    .setTitle(`${client.user.username} help`)
    .setDescription(desc)
    .setThumbnail(client.user.avatarURL())
    .setColor(0x2f3136);

  return new CommandResponse("", embed);
}

export default new Command("help", ["*"], helpHandler, 0);
