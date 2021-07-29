const { Client } = require('discord.js');
const cfg = require('hyarcade-config').fromJSON();

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
module.exports = async function SetPresence(client, type) {
    if(type == undefined || type == "slash") {
        type = "bot";
    }

    client.user.setPresence(getRandomPresence(type))
}