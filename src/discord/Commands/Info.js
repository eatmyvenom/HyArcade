const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("info", ["*"], async (args) => {
    let embed = new MessageEmbed()
        .setTitle(BotUtils.client.user.username + " info")
        .setDescription("A discord bot to allow you to get the stats and info from arcade games and arcade players!")
        .setThumbnail(BotUtils.client.user.avatarURL())
        .addField("Developer", "<@156952208045375488>", false)
        .addField("Github", "[Link](https://github.com/eatmyvenom/party-games-site)", true)
        .addField("Bot invite link", "[Link](https://eatmyvenom.me/share/botinvite.html)", true)
        .addField("Support server", "[Invite](https://discord.gg/W4fkQJsxMd)", true)
        .addField("Website", "[Link](https://hyarcade.xyz)", true)
        .setColor(0x2f3136);
    return { res: "", embed: embed };
});
