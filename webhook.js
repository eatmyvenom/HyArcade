const config = require('./config.json');
const Discord = require("discord.js");

async function sendToDiscord(content) {
    let hook = new Discord.WebhookClient(config.hookid, config.hooktoken);
    await hook.send("```" + content + "```", {
        // impersonate ugy because he does daily lb 
        // in official party games discord server
        username: 'Ujtagrovec',
        avatarURL: 'https://cdn.discordapp.com/avatars/726113755796340770/51cb1ec93b38916bef239bc9681f17fa.webp'
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

module.exports = { send : sendToDiscord };