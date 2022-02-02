const { Presence, Client } = require("discord.js");

const cfg = require("hyarcade-config").fromJSON();

/**
 * @param {string} type
 * @returns {Presence}
 */
function getRandomPresence(type) {
  let presenceArr = cfg.discord.presences;
  if (cfg.discord.setup[type]?.presences != undefined) {
    presenceArr = [...presenceArr, cfg.discord.setup[type].presences];
  }
  return presenceArr[Math.floor(Math.random() * presenceArr.length)];
}

/**
 *
 * @param {Client} client
 * @param {string} type
 */
module.exports = async function SetPresence(client, type) {
  let realType = type;
  if (realType == undefined || realType == "slash") {
    realType = "bot";
  }

  client.user.setPresence(getRandomPresence(realType));
};
