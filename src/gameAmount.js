const Logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Json = require("hyarcade-utils/FileHandling/Json");

/**
 * Get a formatted string of game counts
 *
 * @returns {string}
 */
async function formatCounts() {
  let str = "";
  const all = HypixelApi.counts();
  const counts = all.games;

  str += `Arcade Total        : ${counts.ARCADE.players}\n`;
  str += `Party Games Total   : ${counts.ARCADE.modes.PARTY}\n`;
  str += `HITW Total          : ${counts.ARCADE.modes.HOLE_IN_THE_WALL}\n`;
  str += `Farm Hunt Total     : ${counts.ARCADE.modes.FARM_HUNT}\n`;
  str += `Throw out Total     : ${counts.ARCADE.modes.THROW_OUT}\n`;
  str += `Hypixel says Total  : ${counts.ARCADE.modes.SIMON_SAYS}\n`;
  str += `Ctw Total           : ${counts.ARCADE.modes.PVP_CTW}\n`;
  str += `Limbo Total         : ${counts.LIMBO.players}\n`;
  str += `Idle Total          : ${counts.IDLE.players}\n`;
  str += `Queue Total         : ${counts.QUEUE.players}\n`;
  str += `Total               : ${all.playerCount}`;

  await Json.write("gameCounts.json", counts.ARCADE);
  return str.replace(/undefined/g, "0");
}

/**
 * Print the game counts to stdout
 *
 */
async function logCounts() {
  Logger.out(await formatCounts());
}

module.exports = {
  formatCounts,
  logCounts,
};
