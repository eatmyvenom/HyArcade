const { MessageEmbed } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {number} number
 * @returns {string}
 */
function f (number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 * 
 * @param {Account} acc 
 * @param {MessageEmbed} embed
 * @returns {MessageEmbed}
 */
module.exports = function PixelPainters (acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.pixelPainters.wins)}\`)`);
  embed.addField("Info", `**- AP** (\`${f(acc.arcadeAchievments.pixelPainters.apEarned)} / ${f(acc.arcadeAchievments.pixelPainters.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.pixelPainters)}\`)`);

  return embed;
};