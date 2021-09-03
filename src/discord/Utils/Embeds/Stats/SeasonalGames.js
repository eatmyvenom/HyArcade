const { MessageEmbed } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {number} number
 * @returns {string}
 */
function f (number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 * 
 * @param {Account} acc 
 * @param {MessageEmbed} embed
 * @returns {MessageEmbed}
 */
module.exports = function SeasonalGames (acc, embed) {
  embed.addField("Stats", `**- Total Wins** (\`${f(acc?.seasonalWins?.total ?? 0)}\`)\n**- Easter Wins** (\`${f(acc.seasonalWins.easter)}\`)\n**- Grinch Wins** (\`${f(acc.seasonalWins.grinch)}\`)\n**- Halloween Wins** (\`${f(acc.seasonalWins.halloween)}\`)\n**- Scuba Wins** (\`${f(acc.seasonalWins.scuba)}\`)`);

  return embed;
};