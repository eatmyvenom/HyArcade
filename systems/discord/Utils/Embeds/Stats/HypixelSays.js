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
module.exports = function HypixelSays(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.hypixelSays.wins)}\`)\n` +
      `**- Points** (\`${f(acc.hypixelSays.totalPoints)}\`)\n` +
      `**- Round Wins** (\`${f(acc.hypixelSays.totalRoundWins)}\`)\n` +
      `**- Max Score** (\`${f(acc.hypixelSays.maxScore)}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.hypixelSays.apEarned)} / ${f(
      acc.arcadeAchievments.hypixelSays.apAvailable,
    )}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.hypixelSays)}\`)`,
  );

  return embed;
};
