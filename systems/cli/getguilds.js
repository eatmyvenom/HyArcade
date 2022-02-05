const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  let topTen = await Database.getLeaderboard(args[3], args[4], args[5]);

  topTen = topTen.slice(0, args[6] ?? 50);

  for (const acc of topTen) {
    const guild = await Database.guild(acc.uuid);

    if (guild.name != "INVALID-NAME" && guild.name != undefined) {
      Logger.info(`Fetched ${guild.name}`);
    }
  }
}

module.exports = main;
