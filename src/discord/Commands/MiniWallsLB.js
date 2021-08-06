const {
    MessageEmbed
} = require("discord.js");
const BotUtils = require("../BotUtils");
const Command = require("../../classes/Command");
const listUtils = require("../../listUtils");
const logger = require("hyarcade-logger");
const TimSort = require("timsort");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function wComp(b, a) {
    return (a.miniWallsWins ?? 0) - (b.miniWallsWins ?? 0);
}

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function kComp(b, a) {
    return (a.miniWalls?.kills ?? 0) - (b.miniWalls?.kills ?? 0);
}

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function dComp(b, a) {
    return (a.miniWalls?.deaths ?? 0) - (b.miniWalls?.deaths ?? 0);
}

/**
 * @param {string} n
 * @returns {number}
 */
function int(n) {
    return new Number((`${n}`).replace(/undefined/g, "0").replace(/null/g, "0"));
}

/**
 * @param {Account} n
 * @param {Account} o
 * @returns {Account}
 */
function cb(n, o) {
    o.miniWallsWins = int(n.miniWallsWins) - int(o.miniWallsWins);
    if(n.miniWalls != undefined && o.miniWalls != undefined) {
        o.miniWalls.kills = int(n.miniWalls.kills) - int(o.miniWalls.kills);
        o.miniWalls.deaths = int(n.miniWalls.deaths) - int(o.miniWalls.deaths);
        o.miniWalls.witherDamage = int(n.miniWalls.witherDamage) - int(o.miniWalls.witherDamage);
        o.miniWalls.witherKills = int(n.miniWalls.witherKills) - int(o.miniWalls.witherKills);
        o.miniWalls.finalKills = int(n.miniWalls.finalKills) - int(o.miniWalls.finalKills);
    }

    return o;
}

/**
 * @param {Account} n
 * @returns {Account}
 */
function rcb(n) {
    return n;
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
async function hackerTransformer(list) {
    let hackers = await BotUtils.getFromDB("hackerlist");
    return list.filter((a) => !hackers.includes(a.uuid))
        .filter((a) => a.name != undefined || a.name != "")
        .filter((a) => a.miniWalls != undefined);
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
function top150Transformer(list) {
    TimSort.sort(list, wComp);
    return list.slice(0, Math.min(list.length, 150));
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
async function ratioTransformer(list) {
    return await top150Transformer(await hackerTransformer(list));
}

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @returns {MessageEmbed}
 */
async function getLB(prop, timetype, limit) {
    let res = "";
    let time;

    let comparitor = null;
    let callback = cb;
    let transformer = hackerTransformer;
    let parser = null;
    switch(prop) {
    case "miniWallsWins": {
        comparitor = wComp;
        parser = (a) => {
            return a.miniWallsWins;
        };
        break;
    }

    case "kills": {
        comparitor = kComp;
        parser = (a) => {
            return a.miniWalls?.kills ?? 0;
        };
        break;
    }

    case "deaths": {
        comparitor = dComp;
        parser = (a) => {
            return a.miniWalls?.deaths ?? 0;
        };
        break;
    }

    case "witherDamage": {
        comparitor = (b, a) => {
            return (a.miniWalls?.witherDamage ?? 0) - (b.miniWalls?.witherDamage ?? 0);
        };
        parser = (a) => {
            return a.miniWalls?.witherDamage ?? 0;
        };
        break;
    }
    case "witherKills": {
        comparitor = (b, a) => {
            return (a.miniWalls?.witherKills ?? 0) - (b.miniWalls?.witherKills ?? 0);
        };
        parser = (a) => {
            return a.miniWalls?.witherKills ?? 0;
        };
        break;
    }
    case "finalKills": {
        comparitor = (b, a) => {
            return (a.miniWalls?.finalKills ?? 0) - (b.miniWalls?.finalKills ?? 0);
        };
        parser = (a) => {
            return a.miniWalls?.finalKills ?? 0;
        };
        break;
    }

    case "kd": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (
                ((a.miniWalls?.kills ?? 0) + (a.miniWalls?.finalKills ?? 0)) / (a.miniWalls.deaths ?? 0) -
                ((b.miniWalls?.kills ?? 0) + (b.miniWalls?.finalKills ?? 0)) / (b.miniWalls.deaths ?? 0)
            );
        };
        parser = (a) => {
            return ((a.miniWalls?.kills ?? 0) + (a.miniWalls?.finalKills ?? 0)) / (a.miniWalls.deaths ?? 0).toFixed(3);
        };
        break;
    }

    case "kdnf": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (a.miniWalls?.kills ?? 0) / (a.miniWalls?.deaths ?? 0) - (b.miniWalls?.kills ?? 0) / (b.miniWalls?.deaths ?? 0);
        };
        parser = (a) => {
            return ((a.miniWalls?.kills ?? 0) / (a.miniWalls?.deaths ?? 0)).toFixed(3);
        };
        break;
    }

    case "fd": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (a.miniWalls?.finalKills ?? 0) / (a.miniWalls?.deaths ?? 0) - (b.miniWalls?.finalKills ?? 0) / (b.miniWalls?.deaths ?? 0);
        };
        parser = (a) => {
            return ((a.miniWalls?.finalKills ?? 0) / (a.miniWalls?.deaths ?? 0)).toFixed(3);
        };
        break;
    }

    case "wdd": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (a.miniWalls?.witherDamage ?? 0) / (a.miniWalls?.deaths ?? 0) - (b.miniWalls?.witherDamage ?? 0) / (b.miniWalls?.deaths ?? 0);
        };
        parser = (a) => {
            return ((a.miniWalls?.witherDamage ?? 0) / (a.miniWalls?.deaths ?? 0)).toFixed(3);
        };
        break;
    }

    case "wkd": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (a.miniWalls?.witherKills ?? 0) / (a.miniWalls?.deaths ?? 0) - (b.miniWalls?.witherKills ?? 0) / (b.miniWalls?.deaths ?? 0);
        };
        parser = (a) => {
            return ((a.miniWalls?.witherKills ?? 0) / (a.miniWalls?.deaths ?? 0)).toFixed(3);
        };
        break;
    }

    case "aa": {
        callback = rcb;
        transformer = ratioTransformer;
        comparitor = (b, a) => {
            return (a.miniWalls?.arrowsHit ?? 0) / (a.miniWalls?.arrowsShot ?? 0) - (b.miniWalls?.arrowsHit ?? 0) / (b.miniWalls?.arrowsShot ?? 0);
        };
        parser = (a) => {
            return (((a.miniWalls?.arrowsHit ?? 0) / (a.miniWalls?.arrowsShot ?? 0)) * 100).toFixed(3);
        };
        break;
    }
    }

    switch(timetype) {
    case "d":
    case "day":
    case "daily": {
        time = "Daily";
        res = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", callback, transformer);
        break;
    }

    case "w":
    case "week":
    case "weak":
    case "weekly": {
        time = "Weekly";
        res = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", callback, transformer);
        break;
    }

    case "m":
    case "mon":
    case "month":
    case "monthly": {
        time = "Monthly";
        res = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", callback, transformer);
        break;
    }

    case "a":
    case "all":
    case "*": {
        let day = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", callback, transformer);
        let week = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", callback, transformer);
        let month = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", callback, transformer);
        let life = await listUtils.stringLBAdv(comparitor, parser, limit, transformer);

        day = day == "" ? "Nobody has won" : day;
        week = week == "" ? "Nobody has won" : week;
        month = month == "" ? "Nobody has won" : month;

        let embed = new MessageEmbed()
            .setColor(0xc60532)
            .addField("Daily", day, true)
            .addField("Weekly", week, true)
            .addField("\u200B", "\u200B", true)
            .addField("Monthly", month, true)
            .addField("Lifetime", life, true)
            .addField("\u200B", "\u200B", true);

        return embed;
    }

    default: {
        time = "Lifetime";
        res = await listUtils.stringLBAdv(comparitor, parser, limit, transformer);
        break;
    }
    }

    res = res != "" ? res : "Nobody has won.";
    let embed = new MessageEmbed().setTitle(time).setColor(0xc60532).setDescription(res);

    if(res.length > 6000) {
        return new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0xff0000)
            .setDescription(
                "You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!"
            );
    }

    if(res.length > 2000) {
        let resArr = res.trim().split("\n");
        embed.setDescription("");
        while(resArr.length > 0) {
            let end = Math.min(25, resArr.length);
            embed.addField("\u200b", resArr.slice(0, end).join("\n"), false);
            resArr = resArr.slice(end);
        }
    }

    return embed;
}

module.exports = new Command("mw-leaderboard", ["*"], async (args) => {
    let startTime = Date.now();
    let type = args[0];
    let timetype = args[1] != undefined ? args[1] : "lifetime";
    let limit = args[args.length - 1] != undefined ? args[args.length - 1] : 10;
    if(new Number(limit) != limit) {
        limit = 10;
    }
    let res = "";
    let gameName = "";

    switch((`${type}`).toLowerCase()) {
    case "w":
    case "ws":
    case "win":
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
    case "witherskilled":
    case "killwither":
    case "witherk":
    case "witherkill":
    case "witherkills": {
        gameName = "Wither Kills";
        res = await getLB("witherKills", timetype, limit, "miniWalls");
        break;
    }

    case "f":
    case "fk":
    case "finalkill":
    case "fkill":
    case "final":
    case "finals": {
        gameName = "Final Kills";
        res = await getLB("finalKills", timetype, limit, "miniWalls");
        break;
    }

    case "tkd":
    case "tkdr":
    case "totalkd":
    case "ttlkd":
    case "totalkdr":
    case "f+kd":
    case "f+kdr":
    case "k+fdr":
    case "k+fd":
    case "kfdr":
    case "killdeath": {
        gameName = "Kills+Finals/Deaths";
        res = await getLB("kd", timetype, limit, "miniWalls");
        break;
    }

    case "kd":
    case "k/d":
    case "k/dr":
    case "kdr":
    case "kdnf":
    case "nfkd":
    case "nfkdr":
    case "kdrnf":
    case "kdnofinal": {
        gameName = "Kills/Deaths ratios";
        res = await getLB("kdnf", timetype, limit);
        break;
    }

    case "fdr":
    case "f/d":
    case "fkd":
    case "fkdr":
    case "finaldeath":
    case "fd": {
        gameName = "Finals/Deaths";
        res = await getLB("fd", timetype, limit);
        break;
    }

    case "wdd":
    case "wdr":
    case "wddr":
    case "witherdamagedeath": {
        gameName = "Wither Damage/Deaths";
        res = await getLB("wdd", timetype, limit);
        break;
    }

    case "wkd":
    case "wkdr":
    case "wk/d":
    case "witherkilldeath":
    case "witherkill+d":
    case "wikdr": {
        gameName = "Wither Kills/Deaths";
        res = await getLB("wkd", timetype, limit);
        break;
    }

    case "aa":
    case "arrowacc":
    case "ahm":
    case "arrowhit/miss": {
        gameName = "Arrow accuracy";
        res = await getLB("aa", timetype, limit);
        break;
    }

    default: {
        gameName = "Wins";
        res = await getLB("miniWallsWins", timetype, limit);
        break;
    }
    }

    let finalRes = res
        .setAuthor(`${gameName} Leaderboard`, "https://eatmyvenom.me/share/images/miniwalls.jpg");

    logger.out(`MW Leaderboard command ran in ${Date.now() - startTime}ms`);

    return {
        res: "",
        embed: finalRes
    };
});
