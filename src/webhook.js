const config = require("./Config").fromJSON();
const Discord = require("discord.js");
const { logger } = require("./utils");

/**
 * Send text to a discord webhook
 *
 * @param {String} [content=""]
 * @param {String} [webhookID=config.webhook.id]
 * @param {String} [webhookToken=config.webhook.token]
 * @return {null}
 */
async function sendToDiscord(
    content = "",
    webhookID = config.webhook.id,
    webhookToken = config.webhook.token
) {
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
async function sendToEmbedDiscord(
    txt,
    list,
    webhookID = config.webhook.id,
    webhookToken = config.webhook.token
) {
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

/**
 * Do not look at this... I need a better solution
 * TODO: fix
 * @param {*} list
 * @return {*}
 */
function generateEmbed(list) {
    list = list.filter((item) => item.wins > 0);

    let embed = new Discord.MessageEmbed()
        .setTitle("Daily Leaderboard")
        .setColor(0x0000ff)
        .setTimestamp(Date.now());

    let len = Math.min(list.length, 24);
    for (let i = 0; i < len; i++) {
        embed.addField(i + 1 + ") " + list[i].name, list[i].wins, true);
    }

    return embed;
}

module.exports = {
    send: sendToDiscord,
    sendEmbed: sendToEmbedDiscord,
    sendBasic: sendBasic,
    sendBasicEmbed: sendBasicEmbed,
    generateEmbed: generateEmbed,
};
