const { MessageEmbed } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {number} number
 * @returns {string}
 */
function f(number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 *
 * @param {Account} acc
 * @param {MessageEmbed} embed
 * @returns {MessageEmbed}
 */
module.exports = function SeasonalGames(acc, embed) {
  embed.addField(
    "Stats",
    `**- Total Wins** (\`${f(acc?.seasonalWins?.total ?? 0)}\`)\n**- Easter Wins** (\`${f(acc.seasonalWins.easter)}\`)\n**- Grinch Wins** (\`${f(
      acc.seasonalWins.grinch,
    )}\`)\n**- Halloween Wins** (\`${f(acc.seasonalWins.halloween)}\`)\n**- Scuba Wins** (\`${f(acc.seasonalWins.scuba)}\`)`,
  );
  embed.addField(
    "Info",
    `**- Easter Found** (\`${f(acc.seasonalWins.foundEaster)}\`)\n**- Halloween Found** (\`${f(acc.seasonalWins.foundHalloween)}\`)\n**- Scuba Points** (\`${f(
      acc.seasonalWins.pointsScuba,
    )}\`)`,
  );

  return embed;
};
