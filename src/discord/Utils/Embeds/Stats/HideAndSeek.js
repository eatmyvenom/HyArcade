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
module.exports = function HideAndSeek (acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.hideAndSeek.wins)}\`)\n**- Hider Wins** (\`${f(acc.hideAndSeek.hiderWins)}\`)\n**- Seeker Wins** (\`${f(acc.hideAndSeek.seekerWins)}\`)`);
  embed.addField("Info", `**- AP** (\`${f(acc.arcadeAchievments.hideAndSeek.apEarned)} / ${f(acc.arcadeAchievments.hideAndSeek.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.hideAndSeek)}\`)`);

  return embed;
};