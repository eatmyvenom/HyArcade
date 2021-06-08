const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

function formatR(n) {
    return Math.round(n * 100) / 100
}

function formatN(str) {
    return Intl.NumberFormat("en").format(Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0)));
}

module.exports = new Command("miniwalls", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 1);
    let stats = `Wins: **${formatN(acc.miniWallsWins)}**\n` +
                `Kills: **${formatN(acc.miniWalls.kills)}**\n` +
                `Finals: **${formatN(acc.miniWalls.finalKills)}**\n` +
                `Wither Damage: **${formatN(acc.miniWalls.witherDamage)}**\n` +
                `Wither Kills: **${formatN(acc.miniWalls.witherKills)}**\n` +
                `Deaths: **${formatN(acc.miniWalls.deaths)}**\n`;

    let deaths = acc.miniWalls.deaths
    let ratios = `K/D: **${formatR(acc.miniWalls.kills / deaths)}**\n` +
                    `K/D (no finals): **${formatR((acc.miniWalls.kills - acc.miniWalls.finalKills) / deaths)}**\n` +
                    `F/D: **${formatR(acc.miniWalls.finalKills / deaths)}**\n` +
                    `WD/D: **${formatR(acc.miniWalls.witherDamage / deaths)}**\n` +
                    `WK/D: **${formatR(acc.miniWalls.witherKills / deaths)}**\n` +
                    `Arrow Accuracy: **${formatR(acc.miniWalls.arrowsHit / acc.miniWalls.arrowsShot)}**\n`
                    
    let embed = new MessageEmbed()
        .setTitle("Player: " + acc.name)
        .setColor(0x7873f5)
        .addField("━━━━ Stats: ━━━━", stats, true)
        .addField("━━━━ Ratios: ━━━━", ratios, true);

    return { res: "", embed: embed };
});
