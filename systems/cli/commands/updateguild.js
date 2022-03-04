const Database = require("hyarcade-requests/Database");
const Guild = require("hyarcade-structures/Guild");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  const guild = new Guild(args[3]);
  await guild.updateWins();

  await Database.addGuild(guild);
}

module.exports = main;
