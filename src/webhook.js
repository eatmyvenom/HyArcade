const config = require("./Config").fromJSON();
const Discord = require("discord.js");
const listUtils = require("./listUtils");
const { logger } = require("./utils");

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
    await hook.send("" + content, {
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    await hook.destroy();
}

async function sendBasic(content, webhook) {
    let hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send(content, {
        username: webhook.username,
        avatarURL: webhook.pfp,
    });
    await hook.destroy();
}

async function sendBasicEmbed(content, embed, webhook) {
    let hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send(content, {
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
    await hook.send(txt, {
        embeds: [generateEmbed(list)],
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

async function sendPGEmbed() {
    let hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
    await hook.send("", {
        embeds: [await genPGEmbed()],
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

async function sendPGWEmbed() {
    let hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
    await hook.send("", {
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
    await hook.send("", {
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
    await hook.send("", {
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

    let embed = new Discord.MessageEmbed().setTitle("Party games leaderboards").setColor(0x44a3e7).setTimestamp(Date.now()).addField("------------- Top lifetime wins -------------", alltime, true).addField("--------------- Top daily wins --------------", day, true);

    return embed;
}

async function genTOKillEmbed() {
    let alltime = await listUtils.stringLB("throwOutKills", 10, "extras");

    let embed = new Discord.MessageEmbed().setTitle("Throw out leaderboards").setColor(0x44a3e7).setTimestamp(Date.now()).addField("------------- Top lifetime kills -------------", alltime, true);

    return embed;
}

async function genPGWEmbed() {
    let week = await listUtils.stringLBDiff("wins", 25, "weekly");

    let embed = new Discord.MessageEmbed().setTitle("Party games leaderboards").setColor(0x44a3e7).setTimestamp(Date.now()).addField("-------------- Top weekly wins --------------", week, true);

    return embed;
}

async function genPGMEmbed() {
    let month = await listUtils.stringLBDiff("wins", 25, "monthly");

    let embed = new Discord.MessageEmbed().setTitle("Party games leaderboards").setColor(0x44a3e7).setTimestamp(Date.now()).addField("-------------- Top monthly wins -------------", month, true);

    return embed;
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
    sendTOKillEmbed: sendTOKillEmbed,
};
