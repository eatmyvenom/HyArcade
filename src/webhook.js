const config = require("../config.json");
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
    await hook.send("```" + content + "===========================```", {
        username: config.webhook.username,
        avatarURL: config.webhook.pfp,
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
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
        embeds: generateEmbed(list),
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

    let embeds = [];
    let i,
        j,
        temparray,
        chunk = 24;
    for (i = 0, j = list.length; i < j; i += chunk) {
        temparray = list.slice(i, i + chunk);
        // do whatever
        let embed = new Discord.MessageEmbed()
            //.setTitle('Wins')
            .setColor(0x44a3e7);

        for (let h = 0; h < temparray.length; h++) {
            embed.addField(temparray[h].name, temparray[h].wins, true);
        }
        embeds.push(embed);
    }
    return embeds;
}

module.exports = { send: sendToDiscord, sendEmbed: sendToEmbedDiscord };
