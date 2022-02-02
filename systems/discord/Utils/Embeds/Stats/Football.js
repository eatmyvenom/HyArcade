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
module.exports = function Football(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.football.wins)}\`)\n**- Goals** (\`${f(acc.football.goals)}\`)\n**- Kicks** (\`${f(acc.football.kicks)}\`)\n**- Power Kicks** (\`${f(
      acc.football.powerkicks,
    )}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.football.apEarned)} / ${f(acc.arcadeAchievments.football.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.football)}\`)`,
  );

  return embed;
};
