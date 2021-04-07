const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

function format(str) {
    return formatCase(str).replace(/_/g, " ");
}

function formatCase(str) {
    return (
        ("" + str).slice(0, 1).toUpperCase() + ("" + str).slice(1).toLowerCase()
    );
}

module.exports = new Command("status", ["*"], async (args, rawMsg) => {
    let plr = args[0];

    let acc = await BotUtils.resolveAccount(plr, rawMsg);
    let stslist = await utils.readJSON("./status.json");
    let sts = stslist[acc.uuid];
    let embed;
    if (sts != undefined && sts.online) {
        embed = new MessageEmbed()
            .setTitle(`${formatCase(acc.name)}'s status`)
            .setColor(0x0066cc)
            .addField("Game type", format(sts.gameType), false)
            .addField("Game mode", format(sts.mode), false);

        if (sts.map != undefined) {
            embed.addField("Map", format(sts.map));
        }
    } else {
        embed = new MessageEmbed()
            .setTitle(`${formatCase(acc.name)}'s status`)
            .setColor(0xccccc6)
            .setDescription("Offline");
    }

    return { res: "", embed: embed };
});
