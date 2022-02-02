import { createRequire } from "module";
const require = createRequire(import.meta.url);
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import BotRuntime from "../BotRuntime.js";
const { MessageEmbed } = require("discord.js");

/**
 *
 * @returns {object}
 */
async function infoHandler() {
  const embed = new MessageEmbed()
    .setTitle(`${BotRuntime.client.user.username} info`)
    .setDescription("A discord bot to allow you to get the stats and info from arcade games and arcade players!")
    .setThumbnail(BotRuntime.client.user.avatarURL())
    .addField("Website", "[Link](https://hyarcade.xyz)", false)
    .addField("Github", "[Link](https://github.com/eatmyvenom/hyarcade)", true)
    .addField("Bot invite link", "[Link](https://hyarcade.xyz/botinvite.html)", true)
    .addField("HyArcade server", "[Invite](https://discord.gg/6kFBVDcRd5)", true)
    .addField("Developer", "**` vnmm `** - <@156952208045375488>", false)
    .setColor(0x2f3136);

  return new CommandResponse("", embed);
}

export default new Command("info", ["*"], infoHandler, 0);
