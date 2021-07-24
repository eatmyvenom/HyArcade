const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");
const { ERROR_IGN_UNDEFINED } = require("../Utils/Embeds/StaticEmbeds");

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

function clr(stat1, stat2) {
    if (stat1 > stat2) {
        return ":green_square: ";
    } else {
        return ":red_square: ";
    }
}

function lineN(stat1, stat2, name) {
    return `${clr(stat1, stat2)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

function lineNS(stat1, stat2, name) {
    return `${clr(stat2, stat1)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

function lineR(stat1, stat2, name) {
    return `${clr(stat1, stat2)} **${name}**:\n${formatR(stat1)} | ${formatR(stat2)}\n`;
}

module.exports = new Command("compare", ["*"], async (args, rawMsg, interaction) => {
    if (args.length < 1) {
        return { res: "", embed: ERROR_ARGS_LENGTH(1) };
    }

    let plr1 = args[0];
    let plr2 = args[1];
    let acc1, acc2;
    if (interaction == undefined) {
        if (plr2 == undefined) {
            acc1 = await BotUtils.resolveAccount("undefinednullnothingnononononononono", rawMsg, true);
            acc2 = await BotUtils.resolveAccount(plr1, rawMsg, false);
        } else {
            acc1 = await BotUtils.resolveAccount(plr1, rawMsg, false);
            acc2 = await BotUtils.resolveAccount(plr2, rawMsg, false);
        }
    } else {
        acc1 = await InteractionUtils.resolveAccount(interaction, 0);
        acc2 = await InteractionUtils.resolveAccount(interaction, 1);
    }

    let hackers = await BotUtils.getFromDB("hackerlist");

    if (hackers.includes(acc1.uuid)) {
        acc1 = { miniWallsWins: 0, miniWalls: {} };
    }

    if (hackers.includes(acc2.uuid)) {
        acc2 = { miniWallsWins: 0, miniWalls: {} };
    }

    let embed = new MessageEmbed();

    try {
        let stats =
            lineN(acc1.miniWallsWins, acc2.miniWallsWins, "Wins") +
            lineN(acc1.miniWalls.kills, acc2.miniWalls.kills, "Kills") +
            lineN(acc1.miniWalls.finalKills, acc2.miniWalls.finalKills, "Finals") +
            lineN(acc1.miniWalls.witherDamage, acc2.miniWalls.witherDamage, "Wither Damage") +
            lineN(acc1.miniWalls.witherKills, acc2.miniWalls.witherKills, "Wither Kills") +
            lineNS(acc1.miniWalls.deaths, acc2.miniWalls.deaths, "Deaths");

        let deaths1 = acc1.miniWalls.deaths;
        let deaths2 = acc2.miniWalls.deaths;
        let ratios =
            lineR(
                (acc1.miniWalls.kills + acc1.miniWalls.finalKills) / deaths1,
                (acc2.miniWalls.kills + acc2.miniWalls.finalKills) / deaths2,
                "K/D"
            ) +
            lineR(acc1.miniWalls.kills / deaths1, acc2.miniWalls.kills / deaths2, "K/D (no finals)") +
            lineR(acc1.miniWalls.finalKills / deaths1, acc2.miniWalls.finalKills / deaths2, "F/D") +
            lineR(acc1.miniWalls.witherDamage / deaths1, acc2.miniWalls.witherDamage / deaths2, "WD/D") +
            lineR(acc1.miniWalls.witherKills / deaths1, acc2.miniWalls.witherKills / deaths2, "WK/D") +
            lineR(
                (acc1.miniWalls.arrowsHit / acc1.miniWalls.arrowsShot) * 100,
                (acc2.miniWalls.arrowsHit / acc2.miniWalls.arrowsShot) * 100,
                "Arrow Accuracy"
            );


        embed
            .setTitle(`${acc1.name} VS ${acc2.name}`)
            .setColor(0x7873f5)
            .addField("━━━━━━ Stats: ━━━━━", stats, true)
            .addField("━━━━━ Ratios: ━━━━━", ratios, true);

    } catch(e) {
        return { res: "", embed: ERROR_IGN_UNDEFINED };
    }


    return { res: "", embed: embed };
});
