const { MessageEmbed } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {number} number
 * @returns {number}
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
module.exports = function MiniWalls(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.arcadeWins)}\`)\n` +
      `**- Combined Wins** (\`${f(acc.combinedArcadeWins)}\`)\n` +
      `**- Gamer Quest** (\`${f(acc.quests.arcadeGamer)}\`)\n` +
      `**- Winner Quest** (\`${f(acc.quests.arcadeWinner)}\`)\n` +
      `**- Specialist Quest** (\`${f(acc.quests.arcadeSpecialist)}\`)\n` +
      `**- Coins** (\`${f(acc.arcadeCoins)}\`)`,
  );

  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.totalEarned)} / ${f(acc.arcadeAchievments.totalAvailiable)}\`)\n` +
      `**- Challenges** (\`${f(Object.values(acc.arcadeChallenges).reduce((p, c) => p + c, 0))}\`)\n` +
      `**- Quests** (\`${f(Object.values(acc.quests).reduce((p, c) => p + c, 0))}\`)\n` +
      `**- Level** (\`${f(acc.level.toFixed(2))}\`)\n` +
      `**- Karma** (\`${f(acc.karma)}\`)`,
  );

  return embed;
};
