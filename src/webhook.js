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

async function sendToEmbedDiscord(txt,list, webhookID = config.webhook.id, webhookToken = config.webhook.token) {
    let hook = new Discord.WebhookClient(webhookID, webhookToken);
    await hook.send(txt, {
        embeds: generateEmbed(list) ,
        username: config.webhook.username,
        avatarURL: config.webhook.pfp
    });
    // this closes the hook client so the nodejs doesnt hang
    // forever
    hook.destroy();
}

function generateEmbed(list) {

    list = [].concat(list).filter( item => item.wins > 0);

    let embeds = [];
    let i,j,temparray,chunk = 24;
    for (i=0,j=list.length; i<j; i+=chunk) {
        temparray = list.slice(i,i+chunk);
        // do whatever
        let embed = new Discord.MessageEmbed()
            //.setTitle('Wins')
            .setColor(0x44a3e7)
    
        for (let h = 0; h < temparray.length; h++) {
            embed.addField(temparray[h].name,temparray[h].wins, true);
        }
        embeds.push(embed);
    }
    return embeds;

}

module.exports = { send : sendToDiscord, sendEmbed : sendToEmbedDiscord };