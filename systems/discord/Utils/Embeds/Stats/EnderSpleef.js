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
module.exports = function EnderSpleef(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.enderSpleef.wins)}\`)\n**- Blocks Broken** (\`${f(
      acc.enderSpleef.blocksBroken,
    )}\`)\n**- Powerups** (\`${f(acc.enderSpleef.totalPowerups)}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.enderSpleef.apEarned)} / ${f(
      acc.arcadeAchievments.enderSpleef.apAvailable,
    )}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.enderSpleef)}\`)`,
  );

  return embed;
};
