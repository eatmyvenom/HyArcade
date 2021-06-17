const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    let path = args[args.length - 1];
    let embed = new MessageEmbed()
        .setTitle(acc.name + "." + path)
        .setDescription(acc[path])
        .setColor(0x44a3e7);
    return { res: "", embed: embed };
});
