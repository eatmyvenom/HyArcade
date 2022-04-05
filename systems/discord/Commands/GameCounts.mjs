import axios from "axios";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { MessageEmbed } = require("discord.js");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

/**
 * @returns {string}
 */
async function getGames() {
  const countFetch = await axios.get("https://api.slothpixel.me/api/counts");
  const apiRes = countFetch.data;

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

export default new Command(
  ["game-counts", "gamecounts", "counts", "gc"],
  ["*"],
  async () => {
    const embed = new MessageEmbed()
      .setTitle("Arcade game counts")
      .setColor(0x44a3e7)
      .setDescription(await getGames());

    return new CommandResponse("", embed);
  },
  15000,
);
