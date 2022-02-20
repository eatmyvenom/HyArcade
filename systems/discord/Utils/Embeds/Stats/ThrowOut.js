const { MessageEmbed } = require("discord.js");
const { Account } = require("hyarcade-structures");

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
module.exports = function ThrowOut(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc?.throwOut?.wins ?? 0)}\`)\n**- Kills** (\`${f(acc?.throwOut?.kills ?? 0)}\`)\n**- Deaths** (\`${f(acc?.throwOut?.deaths ?? 0)}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.throwOut.apEarned)} / ${f(acc.arcadeAchievments.throwOut.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc?.arcadeChallenges?.throwOut ?? 0,
    )}\`)\n**- Kills/Deaths** (\`${f(((acc?.throwOut?.kills ?? 0) / (acc?.throwOut?.deaths ?? 0)).toFixed(2))}\`)`,
  );

  return embed;
};
