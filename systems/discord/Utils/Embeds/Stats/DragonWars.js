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
module.exports = function DragonWars(acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.dragonWars.wins)}\`)\n**- Kills** (\`${f(acc.dragonWars.kills)}\`)`);
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.dragonWars.apEarned)} / ${f(acc.arcadeAchievments.dragonWars.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.dragonWars,
    )}\`)`,
  );

  return embed;
};
