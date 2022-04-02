const { MessageEmbed } = require("discord.js");
const { Account } = require("@hyarcade/structures");

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
module.exports = function BlockingDead(acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.blockingDead.wins)}\`)\n**- Kills** (\`${f(acc.blockingDead.kills)}\`)\n**- Headshots** (\`${f(acc.blockingDead.headshots)}\`)`);
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.blockingDead.apEarned)} / ${f(acc.arcadeAchievments.blockingDead.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.blockingDead,
    )}\`)`,
  );

  return embed;
};
