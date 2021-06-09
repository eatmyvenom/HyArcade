const { MessageEmbed, Util } = require("discord.js");
const BotUtils = require("../BotUtils");
const Command = require("../../classes/Command");
const Config = require("../../Config");
const listUtils = require("../../listUtils");
const utils = require("../../utils");
const fs = require("fs/promises");
const { logger } = require("../../utils");

function wComp(b,a) {
    if(a.miniWallsWins == undefined || a.miniWallsWins == NaN) {
        return 1;
    }

    if(b.miniWallsWins == undefined || b.miniWallsWins == NaN) {
        return -1;
    }
    return a.miniWallsWins - b.miniWallsWins;
}

function kComp(b,a) {
    if(a.miniWalls.kills == undefined || a.miniWalls.kills == NaN) {
        return -1;
    }

    if(b.miniWalls.kills == undefined || a.miniWalls.kills == NaN) {
        return 1;
    }
    return a.miniWalls.kills - b.miniWalls.kills;
}

function dComp(b,a) {
    if(a.miniWalls.deaths == undefined || a.miniWalls.deaths == NaN) {
        return -1;
    }

    if(b.miniWalls.deaths == undefined || a.miniWalls.deaths == NaN) {
        return 1;
    }
    return a.miniWalls.deaths - b.miniWalls.deaths;
}

function cb(n,o) {
    o.miniWallsWins = n.miniWallsWins - o.miniWallsWins;
    o.miniWalls.kills = n.miniWalls.kills - o.miniWalls.kills;
    o.miniWalls.deaths = n.miniWalls.deaths - o.miniWalls.deaths;
    o.miniWalls.witherDamage = n.miniWalls.witherDamage - o.miniWalls.witherDamage;
    o.miniWalls.witherKills = n.miniWalls.witherKills - o.miniWalls.witherKills;
    o.miniWalls.finalKills = n.miniWalls.finalKills - o.miniWalls.finalKills;
    return o;
}

async function getLB(prop, timetype, limit, category) {
    let res = "";
    let time;

    let comparitor = null;
    let parser = null;
    switch(prop) {
        case "miniWallsWins": {
            comparitor = wComp;
            parser = (a) => {
                return a.miniWallsWins;
            }
            break;
        }

        case "kills": {
            comparitor = kComp;
            parser = (a) => {
                return a.miniWalls.kills;
            }
            break;
        }

        case "deaths" : {
            comparitor = dComp;
            parser = (a) => {
                return a.miniWalls.deaths;
            }
            break;
        }

        case "witherDamage": {
            comparitor = (b,a) => {
                return a.miniWalls.witherDamage - b.miniWalls.witherDamage;
            }
            parser = (a) => {
                return a.miniWalls.witherDamage;
            }
            break;
        }
        case "witherKills": {
            comparitor = (b,a) => {
                return a.miniWalls.witherKills - b.miniWalls.witherKills;
            }
            parser = (a) => {
                return a.miniWalls.witherKills;
            }
            break;
        }
        case "finalKills": {
            comparitor = (b,a) => {
                return a.miniWalls.finalKills - b.miniWalls.finalKills;
            }
            parser = (a) => {
                return a.miniWalls.finalKills;
            }
            break;
        }
    }

    switch (timetype) {
        case "d":
        case "day":
        case "daily": {
            time = "Daily";
            res = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", cb, BotUtils.fileCache.hackers);
            break;
        }

        case "w":
        case "week":
        case "weak":
        case "weekly": {
            time = "Weekly";
            res = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", cb, BotUtils.fileCache.hackers);
            break;
        }

        case "m":
        case "mon":
        case "month":
        case "monthly": {
            time = "Monthly";
            res = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", cb, BotUtils.fileCache.hackers);
            break;
        }

        case "a":
        case "all":
        case "*": {
            let day = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", cb, BotUtils.fileCache.hackers);
            let week = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", cb, BotUtils.fileCache.hackers);
            let month = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", cb, BotUtils.fileCache.hackers);
            let life = await listUtils.stringLBAdv(comparitor, parser, limit, BotUtils.fileCache.hackers);

            day = day == "" ? "Nobody has won" : day;
            week = week == "" ? "Nobody has won" : week;
            month = month == "" ? "Nobody has won" : month;

            let embed = new MessageEmbed().setColor(0x984daf).addField("Daily", day, true).addField("Weekly", week, true).addField("\u200B", "\u200B", true).addField("Monthly", month, true).addField("Lifetime", life, true).addField("\u200B", "\u200B", true);

            return embed;
            break;
        }

        default: {
            time = "Lifetime";
            res = await listUtils.stringLBAdv(comparitor, parser, limit, BotUtils.fileCache.hackers);
            break;
        }
    }

    res = res != "" ? res : "Nobody has won.";
    let embed = new MessageEmbed().setTitle(time).setColor(0x984daf).setDescription(res);

    if (res.length > 6000) {
        return new MessageEmbed().setTitle("ERROR").setColor(0xff0000).setDescription("You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!");
    }

    if (res.length > 2000) {
        let resArr = res.trim().split("\n");
        embed.setDescription("");
        while (resArr.length > 0) {
            let end = Math.min(25, resArr.length);
            embed.addField("\u200b", resArr.slice(0, end).join("\n"), false);
            resArr = resArr.slice(end);
        }
    }

    return embed;
}

module.exports = new Command("leaderboard", ["*"], async (args) => {
    let startTime = Date.now();
    let type = args[0];
    let timetype = args[1] != undefined ? args[1] : "lifetime";
    let limit = args[2] != undefined ? args[2] : 10;
    let res = "";
    let gameName = "";

    switch (("" + type).toLowerCase()) {

        case "w":
        case "ws":
        case "wins": {
            gameName = "Wins";
            res = await getLB("miniWallsWins", timetype, limit);
            break;
        }

        case "k":
        case "kill":
        case "kil":
        case "kills": {
            gameName = "Kills";
            res = await getLB("kills", timetype, limit, "miniWalls");
            break;
        }

        case "d":
        case "dead":
        case "ded":
        case "death":
        case "deaths": {
            gameName = "Deaths";
            res = await getLB("deaths", timetype, limit, "miniWalls");
            break;
        }

        case "wd":
        case "witherd":
        case "witherdamage":
        case "witherhurted":
        case "damagewither":
        case "witherdmg": {
            gameName = "Wither Damage";
            res = await getLB("witherDamage", timetype, limit, "miniWalls");
            break;
        }

        case "wk":
        case "witherk":
        case "witherkill":
        case "witherkills": {
            gameName = "Wither Kills";
            res = await getLB("witherKills", timetype, limit, "miniWalls");
            break;
        }

        case "f":
        case "finalkill":
        case "fkill":
        case "finals": {
            gameName = "Final Kills";
            res = await getLB("finalKills", timetype, limit, "miniWalls");
            break;
        }

        default: {
            gameName = "Wins";
            res = await getLB("miniWallsWins", timetype, limit);
            break;
        }
    }

    let updatetime = BotUtils.fileCache.updatetime;
    let date = new Date(updatetime.toString());

    let finalRes = res
        .setAuthor(gameName + " leaderboard", "https://eatmyvenom.me/share/images/miniwalls.jpg")
        .setFooter("Data generated at")
        .setTimestamp(date);

    logger.out("MW Leaderboard command ran in " + (Date.now() - startTime) + "ms");

    return { res: "", embed: finalRes };
});
