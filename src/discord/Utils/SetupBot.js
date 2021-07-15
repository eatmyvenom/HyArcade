const { Client } = require('discord.js');
const cfg = require('../../Config').fromJSON();

function getRandomPresence(type) {
    let presenceArr = cfg.discord.presences;
    if(cfg.discord.setup[type].presences != undefined) {
        presenceArr = presenceArr.concat(cfg.discord.setup[type].presences);
    }
    return presenceArr[Math.floor(Math.random() * presenceArr.length)];
}

/**
 * 
 * @param {Client} client 
 * @param {String} type 
 */
module.exports = async function SetupBot(client, type) {
    if(type == undefined || type == "slash") {
        type = "bot";
    }

    client.user.setUsername(cfg.discord.setup[type].username);
    client.user.setPresence(getRandomPresence(type))
}