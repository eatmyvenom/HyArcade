const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const { ERROR_NEED_PLAYER, ERROR_IGN_UNDEFINED } = require("../Utils/Embeds/StaticEmbeds");

function formatR(n) {
    let r = Math.round(n * 1000) / 1000;
    r = r == NaN ? (r = "N/A") : r;
    return r;
}

function formatN(str) {
    let r = Intl.NumberFormat("en").format(Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = r == NaN ? (r = "N/A") : r;
    return r;
}

module.exports = new Command("miniwalls", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let acc;
    if (interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 1);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction, 0);
    }

    let hackers = await BotUtils.getFromDB("hackerlist");
    if (hackers.includes(acc.uuid.toLowerCase())) {
        return {};
    }

    if(acc.uuid == undefined) {
        return { res : "", embed : ERROR_NEED_PLAYER };
    }

    if(acc.miniWalls == undefined) {
        return { res : "", embed : ERROR_IGN_UNDEFINED };
    }

    let stats =
        `Wins: **${formatN(acc.miniWallsWins)}**\n` +
        `Kills: **${formatN(acc.miniWalls.kills)}**\n` +
        `Finals: **${formatN(acc.miniWalls.finalKills)}**\n` +
        `Wither Damage: **${formatN(acc.miniWalls.witherDamage)}**\n` +
        `Wither Kills: **${formatN(acc.miniWalls.witherKills)}**\n` +
        `Deaths: **${formatN(acc.miniWalls.deaths)}**\n`;

    let deaths = acc.miniWalls.deaths;
    let ratios =
        `K/D: **${formatR((acc.miniWalls.kills + acc.miniWalls.finalKills) / deaths)}**\n` +
        `K/D (no finals): **${formatR(acc.miniWalls.kills / deaths)}**\n` +
        `F/D: **${formatR(acc.miniWalls.finalKills / deaths)}**\n` +
        `WD/D: **${formatR(acc.miniWalls.witherDamage / deaths)}**\n` +
        `WK/D: **${formatR(acc.miniWalls.witherKills / deaths)}**\n` +
        `Arrow Accuracy: **${formatR((acc.miniWalls.arrowsHit / acc.miniWalls.arrowsShot) * 100)}**\n`;

    let embed = new MessageEmbed()
        .setTitle("Player: " + acc.name)
        .setColor(0x7873f5)
        .addField("━━━━━━ Stats: ━━━━━", stats, true)
        .addField("━━━━━ Ratios: ━━━━━", ratios, true);

    return { res: "", embed: embed };
});
