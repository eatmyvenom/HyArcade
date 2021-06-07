const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = new Command("miniwalls", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    let stats = `Wins: **${acc.miniWallsWins}**\n` +
                `Kills: **${acc.miniWalls.kills}**\n` +
                `Finals: **${acc.miniWalls.finalKills}**\n` +
                `Wither Damage: **${acc.miniWalls.witherDamage}**\n` +
                `Wither Kills: **${acc.miniWalls.witherKills}**\n` +
                `Deaths: **${acc.miniWalls.deaths}**`;

    let deaths = acc.miniWalls.deaths
    let ratios = `K/D: **${acc.miniWalls.kills / deaths}**\n` +
                    `K/D (no finals): **${(acc.miniWalls.kills - acc.miniWalls.finalKills) / deaths}**\n` +
                    `F/D: **${acc.miniWalls.finalKills / deaths}**\n` +
                    `WD/D: **${acc.miniWalls.witherDamage / deaths}**\n` +
                    `WK/D: **${acc.miniWalls.witherKills / deaths}**\n` +
                    `Arrow Accuracy: **${acc.miniWalls.arrowsShot / acc.miniWalls.arrowsHit}**`
                    
    let embed = new MessageEmbed()
        .setTitle(acc.name + "'s Mini walls stats")
        .setColor(0x44a3e7)
        .addField("Stats:", stats)

    return { res: "", embed: embed };
});
