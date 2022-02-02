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
module.exports = function MiniWalls(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.miniWalls.wins)}\`)\n` +
      `**- Kills** (\`${f(acc.miniWalls.kills)}\`)\n` +
      `**- Final Kills** (\`${f(acc.miniWalls.finalKills)}\`)\n` +
      `**- Deaths** (\`${f(acc.miniWalls.deaths)}\`)\n` +
      `**- Wither Damage** (\`${f(acc.miniWalls.witherDamage)}\`)\n` +
      `**- Wither Kills** (\`${f(acc.miniWalls.witherKills)}\`)\n` +
      `**- Arrows Shot** (\`${f(acc.miniWalls.arrowsShot)}\`)\n` +
      `**- Arrows Hit** (\`${f(acc.miniWalls.arrowsHit)}\`)`,
  );

  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.miniWalls.apEarned)} / ${f(acc.arcadeAchievments.miniWalls.apAvailable)}\`)\n` +
      `**- Challenges** (\`${f(acc.arcadeChallenges.miniWalls)}\`)\n` +
      `**- Kills/Deaths** (\`${f(((acc.miniWalls.finalKills + acc.miniWalls.kills) / acc.miniWalls.deaths).toFixed(2))}\`)\n` +
      `**- Wither Dmg/Deaths** (\`${f((acc.miniWalls.witherDamage / acc.miniWalls.deaths).toFixed(2))}\`)\n` +
      `**- Wither Kills/Deaths** (\`${f((acc.miniWalls.witherKills / acc.miniWalls.deaths).toFixed(2))}\`)`,
  );

  return embed;
};
