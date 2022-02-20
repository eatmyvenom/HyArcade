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
module.exports = function GalaxyWars(acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.galaxyWars.wins)}\`)\n**- Kills** (\`${f(acc.galaxyWars.kills)}\`)\n**- Headshots** (\`${f(acc.galaxyWars.deaths)}\`)`);
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.galaxyWars.apEarned)} / ${f(acc.arcadeAchievments.galaxyWars.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.galaxyWars,
    )}\`)\n**- Kills/Deaths** (\`${f((acc.galaxyWars.kills / acc.galaxyWars.deaths).toFixed(2))}\`)`,
  );

  return embed;
};
