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
module.exports = function CaptureTheWool(acc, embed) {
  embed.addField("Stats", `**- Kills** (\`${f(acc.captureTheWool.kills)}\`)\n**- Captures** (\`${f(acc.captureTheWool.woolCaptures)}\`)`);
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.captureTheWool.apEarned)} / ${f(acc.arcadeAchievments.captureTheWool.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.captureTheWool,
    )}\`)`,
  );

  return embed;
};
