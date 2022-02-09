const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  let accs = await Database.getLeaderboard(args[3], args[4], args[5], false, false, args[6]);

  accs = accs.slice(0, args[6] ?? 50);

  const guildFetches = { none: 0 };

  for (const acc of accs) {
    const guild = await Database.guild(acc.uuid);

    if (guild.name != "INVALID-NAME" && guild.name != undefined) {
      if (guildFetches[guild.name] == undefined) {
        guildFetches[guild.name] = 1;
      } else {
        guildFetches[guild.name] += 1;
      }
      Logger.info(`Fetched ${guild.name}`);
    } else {
      guildFetches.none += 1;
    }
  }

  const arr = Object.entries(guildFetches).sort((a, b) => a[1] - b[1]);

  for (let g of arr) {
    Logger.out(`${g[0]} - ${g[1]}`);
  }
}

module.exports = main;
