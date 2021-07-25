const config = require("../Config").fromJSON();
const Discord = require("discord.js");
const MessageEmbed = Discord.MessageEmbed;
const listUtils = require("../listUtils");
const logger = require("hyarcade-logger");
const fs = require("fs/promises");
const Runtime = require("../Runtime");
const utils = require("../utils");

/**
 * Send text to a discord webhook
 *
 * @param {String} [content=""]
 * @param {String} [webhookID=config.webhook.id]
 * @param {String} [webhookToken=config.webhook.token]
 * @return {null}
 */
async function sendToDiscord(content = "", webhookID = config.webhook.id, webhookToken = config.webhook.token) {
    if (content == "") {
        logger.err("Refusing to send empty message to webhook!");
        return;
    }
    let hook = new Discord.WebhookClient(webhookID, webhookToken);
    await hook.send({
        content: content,
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    await hook.destroy();
}

async function sendBasic(content, webhook) {
    let hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send({
        content: content,
        username: webhook.username,
        avatarURL: webhook.pfp,
    });
    await hook.destroy();
}

async function sendBasicEmbed(content, embed, webhook) {
    let hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send({
        embeds: embed,
        username: webhook.username,
        avatarURL: webhook.pfp,
    });
    await hook.destroy();
}

/**
 * Send text and a list to a discord webhook to be embedded
 *
 * @param {String} txt
 * @param {String[]} list
 * @param {String} [webhookID=config.webhook.id]
 * @param {String} [webhookToken=config.webhook.token]
 */
async function sendToEmbedDiscord(txt, list, webhookID = config.webhook.id, webhookToken = config.webhook.token) {
    let hook = new Discord.WebhookClient(webhookID, webhookToken);
    await hook.send({
        embeds: [generateEmbed(list)],
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

async function sendEmbed(embed, webhook) {
    let hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send({
        embeds: [embed],
        username: webhook.username,
        avatarURL: webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    await hook.destroy();
}

async function sendPGEmbed() {
    await sendEmbed(await genPGEmbed(), config.webhook);
}

async function sendHSEmbed() {
    await sendEmbed(await genHSEmbed(), config.otherHooks.HS);
}

async function sendHSWEmbed() {
    await sendEmbed(await genHSWEmbed(), config.otherHooks.HS);
}

async function sendHSMEmbed() {
    await sendEmbed(await genHSMEmbed(), config.otherHooks.HS);
}

async function sendPGWEmbed() {
    let hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
    await hook.send({
        embeds: [await genPGWEmbed()],
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

async function sendPGMEmbed() {
    let hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
    await hook.send({
        embeds: [await genPGMEmbed()],
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

async function sendTOKillEmbed() {
    let hook = new Discord.WebhookClient(config.otherHooks.TO.id, config.otherHooks.TO.token);
    await hook.send({
        embeds: [await genTOKillEmbed()],
        username: config.otherHooks.TO.username,
        avatarURL: config.otherHooks.TO.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

/**
 * Do not look at this... I need a better solution
 * TODO: fix
 * @param {*} list
 * @return {*}
 */
function generateEmbed(list) {
    list = list.filter((item) => item.wins > 0);

    let embed = new Discord.MessageEmbed().setTitle("Daily Leaderboard").setColor(0x44a3e7).setTimestamp(Date.now());

    let str = "";

    let len = Math.min(list.length, 24);
    for (let i = 0; i < len; i++) {
        str += i + 1 + ") " + list[i].name + " - " + list[i].wins + "\n";
    }
    embed.setDescription(str);

    return embed;
}

async function genPGEmbed() {
    let alltime = await listUtils.stringLB("wins", 25);
    let day = await listUtils.stringLBDaily("wins", 25);

    let embed = new Discord.MessageEmbed()
        .setTitle("Party games leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("------------- Top lifetime wins -------------", alltime, true)
        .addField("--------------- Top daily wins --------------", day, true);

    return embed;
}

async function genTOKillEmbed() {
    let alltime = await listUtils.stringLB("throwOutKills", 10, "extras");

    let embed = new Discord.MessageEmbed()
        .setTitle("Throw out leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("------------- Top lifetime kills -------------", alltime, true);

    return embed;
}

async function genPGWEmbed() {
    let week = await listUtils.stringLBDiff("wins", 25, "weekly");

    let embed = new Discord.MessageEmbed()
        .setTitle("Party games leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("-------------- Top weekly wins --------------", week, true);

    return embed;
}

async function genPGMEmbed() {
    let month = await listUtils.stringLBDiff("wins", 25, "monthly");

    let embed = new Discord.MessageEmbed()
        .setTitle("Party games leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("-------------- Top monthly wins -------------", month, true);

    return embed;
}

async function genHSEmbed() {
    let alltime = await listUtils.stringLB("hypixelSaysWins", 25);
    let day = await listUtils.stringLBDaily("hypixelSaysWins", 25);

    let embed = new Discord.MessageEmbed()
        .setTitle("Hypixel says leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("------------- Top lifetime wins -------------", alltime, true)
        .addField("--------------- Top daily wins --------------", day, true);

    return embed;
}

async function genHSWEmbed() {
    let week = await listUtils.stringLBDiff("hypixelSaysWins", 25, "weekly");

    let embed = new Discord.MessageEmbed()
        .setTitle("Hypixel says leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("-------------- Top weekly wins --------------", week, true);

    return embed;
}

async function genHSMEmbed() {
    let month = await listUtils.stringLBDiff("hypixelSaysWins", 25, "monthly");

    let embed = new Discord.MessageEmbed()
        .setTitle("Hypixel says leaderboards")
        .setColor(0x44a3e7)
        .setTimestamp(Date.now())
        .addField("-------------- Top monthly wins -------------", month, true);

    return embed;
}

function wComp(b, a) {
    if (a.miniWallsWins == undefined || a.miniWallsWins == NaN || a.miniWalls == undefined) {
        return 1;
    }

    if (b.miniWallsWins == undefined || b.miniWallsWins == NaN || b.miniWalls == undefined) {
        return -1;
    }
    return a.miniWallsWins - b.miniWallsWins;
}

function kComp(b, a) {
    if (a.miniWalls?.kills == undefined || a.miniWalls?.kills == NaN) {
        return -1;
    }

    if (b.miniWalls?.kills == undefined || a.miniWalls?.kills == NaN) {
        return 1;
    }
    return a.miniWalls.kills - b.miniWalls.kills;
}

function dComp(b, a) {
    if (a.miniWalls?.deaths == undefined || a.miniWalls.deaths == NaN) {
        return -1;
    }

    if (b.miniWalls?.deaths == undefined || a.miniWalls?.deaths == NaN) {
        return 1;
    }
    return a.miniWalls.deaths - b.miniWalls.deaths;
}

function int(n) {
    return new Number(("" + n).replace(/undefined/g, "0").replace(/null/g, "0"));
}

function cb(n, o) {
    o.miniWallsWins = int(n.miniWallsWins) - int(o.miniWallsWins);
    o.miniWalls.kills = int(n.miniWalls?.kills) - int(o.miniWalls?.kills);
    o.miniWalls.deaths = int(n.miniWalls?.deaths) - int(o.miniWalls?.deaths);
    o.miniWalls.witherDamage = int(n.miniWalls?.witherDamage) - int(o.miniWalls?.witherDamage);
    o.miniWalls.witherKills = int(n.miniWalls?.witherKills) - int(o.miniWalls?.witherKills);
    o.miniWalls.finalKills = int(n.miniWalls?.finalKills) - int(o.miniWalls?.finalKills);
    return o;
}

function rcb(n, o) {
    return n;
}

async function hackerTransformer(list) {
    let hackerlist = (await fs.readFile("data/hackerlist")).toString().split("\n");
    list = list.filter((a) => !hackerlist.includes(a.uuid));
    list = list.filter((a) => a != {});
    list = list.filter((a) => a.name != undefined);
    return list;
}

function top150Transformer(list) {
    list = list.sort(wComp);
    list = list.slice(0, Math.min(list.length, 150));
    return list;
}

async function ratioTransformer(list) {
    list = await hackerTransformer(list);
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
    switch (prop) {
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
                return a.miniWalls.kills;
            };
            break;
        }

        case "deaths": {
            comparitor = dComp;
            parser = (a) => {
                return a.miniWalls.deaths;
            };
            break;
        }

        case "witherDamage": {
            comparitor = (b, a) => {
                if (a.miniWalls?.witherDamage == undefined || a.miniWalls?.witherDamage == NaN) {
                    return -1;
                }

                if (b.miniWalls?.witherDamage == undefined || a.miniWalls?.witherDamage == NaN) {
                    return 1;
                }
                return a.miniWalls.witherDamage - b.miniWalls.witherDamage;
            };
            parser = (a) => {
                return a.miniWalls.witherDamage;
            };
            break;
        }
        case "witherKills": {
            comparitor = (b, a) => {
                if (a.miniWalls?.witherKills == undefined || a.miniWalls?.witherKills == NaN) {
                    return -1;
                }

                if (b.miniWalls?.witherKills == undefined || a.miniWalls?.witherKills == NaN) {
                    return 1;
                }
                return a.miniWalls.witherKills - b.miniWalls.witherKills;
            };
            parser = (a) => {
                return a.miniWalls.witherKills;
            };
            break;
        }
        case "finalKills": {
            comparitor = (b, a) => {
                if (a.miniWalls?.finalKills == undefined || a.miniWalls?.finalKills == NaN) {
                    return -1;
                }

                if (b.miniWalls?.finalKills == undefined || a.miniWalls?.finalKills == NaN) {
                    return 1;
                }
                return a.miniWalls.finalKills - b.miniWalls.finalKills;
            };
            parser = (a) => {
                return a.miniWalls.finalKills;
            };
            break;
        }

        case "kd": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls?.kills == undefined || a.miniWalls?.kills == NaN) return -1;
                if (b.miniWalls?.kills == undefined || b.miniWalls?.kills == NaN) return 1;
                return (
                    (a.miniWalls.kills + a.miniWalls.finalKills) / a.miniWalls.deaths -
                    (b.miniWalls.kills + b.miniWalls.finalKills) / b.miniWalls.deaths
                );
            };
            parser = (a) => {
                return ((a.miniWalls.kills + a.miniWalls.finalKills) / a.miniWalls.deaths).toFixed(3);
            };
            break;
        }

        case "kdnf": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls.kills == undefined || a.miniWalls.kills == NaN) return -1;
                if (b.miniWalls.kills == undefined || b.miniWalls.kills == NaN) return 1;
                return a.miniWalls.kills / a.miniWalls.deaths - b.miniWalls.kills / b.miniWalls.deaths;
            };
            parser = (a) => {
                return (a.miniWalls.kills / a.miniWalls.deaths).toFixed(3);
            };
            break;
        }

        case "fd": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls?.kills == undefined || a.miniWalls?.kills == NaN) return -1;
                if (b.miniWalls?.kills == undefined || b.miniWalls?.kills == NaN) return 1;
                return a.miniWalls.finalKills / a.miniWalls.deaths - b.miniWalls.finalKills / b.miniWalls.deaths;
            };
            parser = (a) => {
                return (a.miniWalls.finalKills / a.miniWalls.deaths).toFixed(3);
            };
            break;
        }

        case "wdd": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls?.witherDamage == undefined || a.miniWalls?.witherDamage == NaN) return -1;
                if (b.miniWalls?.witherDamage == undefined || b.miniWalls?.witherDamage == NaN) return 1;
                return a.miniWalls.witherDamage / a.miniWalls.deaths - b.miniWalls.witherDamage / b.miniWalls.deaths;
            };
            parser = (a) => {
                return (a.miniWalls.witherDamage / a.miniWalls.deaths).toFixed(3);
            };
            break;
        }

        case "wkd": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls.witherKills == undefined || a.miniWalls.witherKills == NaN) return -1;
                if (b.miniWalls.witherKills == undefined || b.miniWalls.witherKills == NaN) return 1;
                return a.miniWalls.witherKills / a.miniWalls.deaths - b.miniWalls.witherKills / b.miniWalls.deaths;
            };
            parser = (a) => {
                return (a.miniWalls.witherKills / a.miniWalls.deaths).toFixed(3);
            };
            break;
        }

        case "aa": {
            callback = rcb;
            transformer = ratioTransformer;
            comparitor = (b, a) => {
                if (a.miniWalls.arrowsShot == undefined || a.miniWalls.arrowsShot == NaN) return -1;
                if (b.miniWalls.arrowsShot == undefined || b.miniWalls.arrowsShot == NaN) return 1;
                return a.miniWalls.arrowsHit / a.miniWalls.arrowsShot - b.miniWalls.arrowsHit / b.miniWalls.arrowsShot;
            };
            parser = (a) => {
                return ((a.miniWalls.arrowsHit / a.miniWalls.arrowsShot) * 100).toFixed(3);
            };
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

            let embed = new MessageEmbed()
                .setColor(0x984daf)
                .addField("Daily", day, true)
                .addField("Weekly", week, true)
                .addField("\u200B", "\u200B", true)
                .addField("Monthly", month, true)
                .addField("Lifetime", life, true)
                .addField("\u200B", "\u200B", true);

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
        return new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0xff0000)
            .setDescription(
                "You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!"
            );
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

async function getMW(prop, a) {
    return await getLB(prop, "l", a);
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

async function sendMW() {
    let run = Runtime.fromJSON();
    let mwMsg = run.mwMsg;

    let guildlist = await utils.readJSON("guild.json");
    guildlist.sort((a,b)=>{
        return b.miniWallsWins - a.miniWallsWins;
    });

    let str = "";
    guildlist = guildlist.filter(g=>g.uuid!="5cf6ddfb77ce842c855426b0");
    for(let i = 0;i < Math.min(10, guildlist.length); i++) {
        let g = guildlist[i];
        str += `${i + 1}) **${g.name}** (${formatNum(g.miniWallsWins)})\n`
    }

    let gEmbed = new MessageEmbed()
        .setTitle("Lifetime Guild Wins")
        .setDescription(str)
        .setColor(0xc60532);

    let wins = await getMW("miniWallsWins", 25);
    let kills = await getMW("kills", 10);
    let finals = await getMW("finalKills", 10);
    let witherdmg = await getMW("witherDamage", 10);
    let witherkills = await getMW("witherKills", 10);
    let guilds = gEmbed;

    wins.setTitle("Lifetime Wins");
    kills.setTitle("Lifetime Kills");
    finals.setTitle("Lifetime Finals");
    witherdmg.setTitle("Lifetime Wither Damage");
    witherkills.setTitle("Lifetime Wither Kills");
    let hook = new Discord.WebhookClient(config.otherHooks.MW.id, config.otherHooks.MW.token);
    try {
        await hook.deleteMessage(mwMsg);
    } catch (e) {
        logger.err(e);
    }
    let newMsg = await hook.send({
        embeds: [wins, kills, finals, witherdmg, witherkills, guilds],
        username: config.otherHooks.MW.username,
        avatarURL: config.otherHooks.MW.pfp,
    });

    run.mwMsg = newMsg.id;
    await run.save();
}

module.exports = {
    send: sendToDiscord,
    sendEmbed: sendToEmbedDiscord,
    sendBasic: sendBasic,
    sendBasicEmbed: sendBasicEmbed,
    generateEmbed: generateEmbed,
    genPGEmbed: genPGEmbed,
    sendPGEmbed: sendPGEmbed,
    sendPGWEmbed: sendPGWEmbed,
    sendPGMEmbed: sendPGMEmbed,
    sendHSEmbed: sendHSEmbed,
    sendHSWEmbed: sendHSWEmbed,
    sendHSMEmbed: sendHSMEmbed,
    sendTOKillEmbed: sendTOKillEmbed,
    sendMW: sendMW,
};
