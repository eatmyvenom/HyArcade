const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("info", ["*"], async () => {
    let embed = new MessageEmbed()
        .setTitle(BotUtils.client.user.username + " info")
        .setDescription("A discord bot to allow you to get the stats and info from arcade games and arcade players!")
        .setThumbnail(BotUtils.client.user.avatarURL())
        .addField("Website", "[Link](https://hyarcade.xyz)", false)
        .addField("Github", "[Link](https://github.com/eatmyvenom/party-games-site)", true)
        .addField("Bot invite link", "[Link](https://hyarcade.xyz/botinvite.html)", true)
        .addField("HyArcade server", "[Invite](https://discord.gg/6kFBVDcRd5)", true)
        .addField("Developer", "<@156952208045375488>", false)
        .setColor(0x2f3136);
    return { res: "", embed: embed };
});
