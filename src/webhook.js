const config = require('../config.json');
const Discord = require("discord.js");

async function sendToDiscord(content, webhookID = config.webhook.id, webhookToken = config.webhook.token) {
    let hook = new Discord.WebhookClient(webhookID, webhookToken);
    await hook.send("```" + content + "===========================```", {
        username: config.webhook.username,
        avatarURL: config.webhook.pfp
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

module.exports = { send : sendToDiscord };