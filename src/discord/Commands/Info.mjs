import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MessageEmbed } = require("discord.js");
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";

export default new Command("info", ["*"], async () => {
  const embed = new MessageEmbed()
    .setTitle(`${BotRuntime.client.user.username} info`)
    .setDescription("A discord bot to allow you to get the stats and info from arcade games and arcade players!")
    .setThumbnail(BotRuntime.client.user.avatarURL())
    .addField("Website", "[Link](https://hyarcade.xyz)", false)
    .addField("Github", "[Link](https://github.com/eatmyvenom/party-games-site)", true)
    .addField("Bot invite link", "[Link](https://hyarcade.xyz/botinvite.html)", true)
    .addField("HyArcade server", "[Invite](https://discord.gg/6kFBVDcRd5)", true)
    .addField("Developer", "<@156952208045375488>", false)
    .setColor(0x2f3136);
  return {
    res: "",
    embed
  };
});
