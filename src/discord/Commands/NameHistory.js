const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg);
    let embed = new MessageEmbed()
        .setTitle(`${acc.name} IGN history`)
        .setDescription(([].concat(acc.nameHist)).join("\n"))
        .setColor(0x44a3e7);
    return {
        res: "",
        embed: embed
    };
});
