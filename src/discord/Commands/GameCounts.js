const {
  MessageEmbed
} = require("discord.js");
const { default: fetch } = require("node-fetch");
const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

/**
 * @returns {string}
 */
async function getGames () {
  const apiRes = await (await fetch("https://api.slothpixel.me/api/counts")).json();

  const arcade = apiRes.games.ARCADE;

  let str = "";
  str += `**${arcade.name}** - \` ${numberify(arcade.players)} \`\n\n`;

  const modes = Object.values(arcade.modes);

  modes.sort((a, b) => b.players - a.players);

  for (const game of modes) {
    str += `• **${game.name}** - \` ${numberify(game.players)} \`\n`;
  }

  return str;
}

module.exports = new Command(["game-counts", "gamecounts", "counts", "gc"], ["*"], async () => {
  const embed = new MessageEmbed()
    .setTitle("Arcade game counts")
    .setColor(0x44a3e7)
    .setDescription(await getGames());

  return new CommandResponse("", embed);
}, 15000);
