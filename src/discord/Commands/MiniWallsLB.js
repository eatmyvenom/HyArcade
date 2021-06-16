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

function int(n) {
    return new Number(("" +n).replace(/undefined/g, "0").replace(/null/g, "0"));
}

function cb(n,o) {
    o.miniWallsWins = int(n.miniWallsWins) - int(o.miniWallsWins);
    o.miniWalls.kills = int(n.miniWalls.kills) - int(o.miniWalls.kills);
    o.miniWalls.deaths = int(n.miniWalls.deaths) - int(o.miniWalls.deaths);
    o.miniWalls.witherDamage = int(n.miniWalls.witherDamage) - int(o.miniWalls.witherDamage);
    o.miniWalls.witherKills = int(n.miniWalls.witherKills) - int(o.miniWalls.witherKills);
    o.miniWalls.finalKills = int(n.miniWalls.finalKills) - int(o.miniWalls.finalKills);
    return o;
}

function rcb(n,o) {
    return n;
}

function hackerTransformer(list) {
    list = list.filter(a => !BotUtils.fileCache.hackers.includes(a.uuid));
    return list;
}

function top150Transformer(list) {
    list = list.sort(wComp);
    list = list.slice(0,Math.min(list.length, 150));
    return list;
}

function ratioTransformer(list) {
    list = hackerTransformer(list);
    list = top150Transformer(list);
    return list;
}

async function getLB(prop, timetype, limit, category) {
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
                if(a.miniWalls.witherDamage == undefined || a.miniWalls.witherDamage == NaN) {
                    return -1;
                }
            
                if(b.miniWalls.witherDamage == undefined || a.miniWalls.witherDamage == NaN) {
                    return 1;
                }
                return a.miniWalls.witherDamage - b.miniWalls.witherDamage;
            }
            parser = (a) => {
                return a.miniWalls.witherDamage;
            }
            break;
        }
        case "witherKills": {
            comparitor = (b,a) => {
                if(a.miniWalls.witherKills == undefined || a.miniWalls.witherKills == NaN) {
                    return -1;
                }
            
                if(b.miniWalls.witherKills == undefined || a.miniWalls.witherKills == NaN) {
                    return 1;
                }
                return a.miniWalls.witherKills - b.miniWalls.witherKills;
            }
            parser = (a) => {
                return a.miniWalls.witherKills;
            }
            break;
        }
        case "finalKills": {
            comparitor = (b,a) => {
                if(a.miniWalls.finalKills == undefined || a.miniWalls.finalKills == NaN) {
                    return -1;
                }
            
                if(b.miniWalls.finalKills == undefined || a.miniWalls.finalKills == NaN) {
                    return 1;
                }
                return a.miniWalls.finalKills - b.miniWalls.finalKills;
            }
            parser = (a) => {
                return a.miniWalls.finalKills;
            }
            break;
        }

        case "kd" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.kills == undefined || a.miniWalls.kills == NaN) return -1;
                if(b.miniWalls.kills == undefined || b.miniWalls.kills == NaN) return 1;
                return ((a.miniWalls.kills + a.miniWalls.finalKills) / a.miniWalls.deaths) - ((b.miniWalls.kills + b.miniWalls.finalKills) / b.miniWalls.deaths)
            }
            parser = (a) => { return ((a.miniWalls.kills + a.miniWalls.finalKills) / a.miniWalls.deaths).toFixed(3) };
            break;
        }

        case "kdnf" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.kills == undefined || a.miniWalls.kills == NaN) return -1;
                if(b.miniWalls.kills == undefined || b.miniWalls.kills == NaN) return 1;
                return ((a.miniWalls.kills) / a.miniWalls.deaths) - ((b.miniWalls.kills) / b.miniWalls.deaths)
            }
            parser = (a) => { return ((a.miniWalls.kills) / a.miniWalls.deaths).toFixed(3) };
            break;
        }


        case "fd" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.kills == undefined || a.miniWalls.kills == NaN) return -1;
                if(b.miniWalls.kills == undefined || b.miniWalls.kills == NaN) return 1;
                return ((a.miniWalls.finalKills) / a.miniWalls.deaths) - ((b.miniWalls.finalKills) / b.miniWalls.deaths)
            }
            parser = (a) => { return ((a.miniWalls.finalKills) / a.miniWalls.deaths).toFixed(3) };
            break;
        }

        case "wdd" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.witherDamage == undefined || a.miniWalls.witherDamage == NaN) return -1;
                if(b.miniWalls.witherDamage == undefined || b.miniWalls.witherDamage == NaN) return 1;
                return ((a.miniWalls.witherDamage) / a.miniWalls.deaths) - ((b.miniWalls.witherDamage) / b.miniWalls.deaths)
            }
            parser = (a) => { return ((a.miniWalls.witherDamage) / a.miniWalls.deaths).toFixed(3) };
            break;
        }

        case "wkd" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.witherKills == undefined || a.miniWalls.witherKills == NaN) return -1;
                if(b.miniWalls.witherKills == undefined || b.miniWalls.witherKills == NaN) return 1;
                return ((a.miniWalls.witherKills) / a.miniWalls.deaths) - ((b.miniWalls.witherKills) / b.miniWalls.deaths)
            }
            parser = (a) => { return ((a.miniWalls.witherKills) / a.miniWalls.deaths).toFixed(3) };
            break;
        }

        case "aa" : {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b,a) => {
                if(a.miniWalls.arrowsShot == undefined || a.miniWalls.arrowsShot == NaN) return -1;
                if(b.miniWalls.arrowsShot == undefined || b.miniWalls.arrowsShot == NaN) return 1;
                return ((a.miniWalls.arrowsHit) / a.miniWalls.arrowsShot) - ((b.miniWalls.arrowsHit) / b.miniWalls.arrowsShot)
            }
            parser = (a) => { return (((a.miniWalls.arrowsHit) / a.miniWalls.arrowsShot) * 100).toFixed(3) };
            break;
        }
    }

    switch (timetype) {
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

            let embed = new MessageEmbed().setColor(0xc60532).addField("Daily", day, true).addField("Weekly", week, true).addField("\u200B", "\u200B", true).addField("Monthly", month, true).addField("Lifetime", life, true).addField("\u200B", "\u200B", true);

            return embed;
            break;
        }

        default: {
            time = "Lifetime";
            res = await listUtils.stringLBAdv(comparitor, parser, limit, transformer);
            break;
        }
    }

    res = res != "" ? res : "Nobody has won.";
    let embed = new MessageEmbed().setTitle(time).setColor(0xc60532).setDescription(res);

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

module.exports = new Command("mwlb", ["*"], async (args) => {
    let startTime = Date.now();
    let type = args[0];
    let timetype = args[1] != undefined ? args[1] : "lifetime";
    let limit = args[args.length - 1] != undefined ? args[args.length - 1] : 10;
    if((new Number(limit)) != limit) {
        limit = 10;
    }
    let res = "";
    let gameName = "";

    switch (("" + type).toLowerCase()) {

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

    let updatetime = BotUtils.fileCache.updatetime;
    let date = new Date(updatetime.toString());

    let finalRes = res
        .setAuthor(gameName + " Leaderboard", "https://eatmyvenom.me/share/images/miniwalls.jpg")
        .setFooter("Data generated at")
        .setTimestamp(date);

    logger.out("MW Leaderboard command ran in " + (Date.now() - startTime) + "ms");

    return { res: "", embed: finalRes };
});
