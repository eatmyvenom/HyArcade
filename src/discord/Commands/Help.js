const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("help", ["*"], async () => {
    let desc = "";
    if(BotUtils.botMode == "mini") {
        desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Commands)";
    } else {
        desc = "Read about how to use the arcade bot [here](https://docs.hyarcade.xyz/Bot-Commands)";
    }

    let embed = new MessageEmbed()
        .setTitle(BotUtils.client.user.username + " help")
        .setDescription(desc)
        .setThumbnail(BotUtils.client.user.avatarURL())
        .setColor(0x2f3136);
    return { res: "", embed: embed };
});
