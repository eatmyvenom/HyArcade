const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const AdvancedEmbeds = require("../AdvancedEmbeds");
const BotUtils = require("../BotUtils");
const { errLen } = require("../Embeds");
const InteractionUtils = require("../interactions/InteractionUtils");

function formatR(n) {
    let r = Math.round(n * 100) / 100
    r = (r == NaN) ? r = "N/A" : r;
    return r;
}

function formatN(str) {
    let r = Intl.NumberFormat("en").format(Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = (r == NaN) ? r = "N/A" : r;
    return r;
}

function clr(stat1, stat2) {
    if(stat1 > stat2) {
        return ":green_square: "
    } else {
        return ":red_square: "
    }
}

function lineN(stat1, stat2, name) {
    return `${clr(stat1, stat2)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

function lineR(stat1, stat2, name) {
    return `${clr(stat1, stat2)} **${name}**:\n${formatR(stat1)} | ${formatR(stat2)}\n`;
}

module.exports = new Command("compare", ["*"], async (args, rawMsg, interaction) => {
    if(args.length < 2) {
        return {res : "", embed:  errLen(2)};
    }

    let plr1 = args[0];
    let plr2 = args[1];
    let acc1, acc2;
    if (interaction == undefined) {
        acc1 = await BotUtils.resolveAccount(plr1, rawMsg, false);
        acc2 = await BotUtils.resolveAccount(plr2, rawMsg, false);
    } else {
        acc1 = await InteractionUtils.resolveAccount(interaction, 0);
        acc2 = await InteractionUtils.resolveAccount(interaction, 1);
    }

    let embed = new MessageEmbed();

    let stats = lineN(acc1.miniWallsWins, acc2.miniWallsWins, "Wins") +
                lineN(acc1.miniWalls.kills, acc2.miniWalls.kills, "Kills") +
                lineN(acc1.miniWalls.finalKills, acc2.miniWalls.finalKills, "Finals") +
                lineN(acc1.miniWalls.witherDamage, acc2.miniWalls.witherDamage, "Wither Damage") +
                lineN(acc1.miniWalls.witherKills, acc2.miniWalls.witherKills, "Wither Kills") +
                lineN(acc1.miniWalls.deaths, acc2.miniWalls.deaths, "Deaths");

    let deaths1 = acc1.miniWalls.deaths
    let deaths2 = acc2.miniWalls.deaths
    let ratios = lineR((acc1.miniWalls.kills + acc1.miniWalls.finalKills) / deaths1, (acc2.miniWalls.kills + acc2.miniWalls.finalKills) / deaths2, "K/D") +
                    lineR((acc1.miniWalls.kills) / deaths1, (acc2.miniWalls.kills) / deaths2, "K/D (no finals)") +
                    lineR((acc1.miniWalls.finalKills) / deaths1, (acc2.miniWalls.finalKills) / deaths2, "F/D") +
                    lineR((acc1.miniWalls.witherDamage) / deaths1, (acc2.miniWalls.witherDamage) / deaths2, "WD/D") +
                    lineR((acc1.miniWalls.witherKills) / deaths1, (acc2.miniWalls.witherKills) / deaths2, "WK/D") +
                    lineR((acc1.miniWalls.arrowsHit / acc1.miniWalls.arrowsShot) * 100, (acc2.miniWalls.arrowsHit / acc2.miniWalls.arrowsShot) * 100, "Arrow Accuracy");

    embed.setTitle(`${acc1.name} VS ${acc2.name}`)
        .setColor(0x7873f5)
        .addField('━━━━━━ Stats: ━━━━━', stats, true)
        .addField('━━━━━ Ratios: ━━━━━', ratios, true);


    return { res: "", embed: embed };
});
