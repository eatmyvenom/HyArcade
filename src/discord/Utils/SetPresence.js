const cfg = require("hyarcade-config").fromJSON();

/**
 * @param type
 */
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
 * @param {string} type 
 */
module.exports = async function SetPresence(client, type) {
    if(type == undefined || type == "slash") {
        type = "bot";
    }

    client.user.setPresence(getRandomPresence(type));
};
