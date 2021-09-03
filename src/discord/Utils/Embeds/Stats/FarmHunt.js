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
module.exports = function FarmHunt (acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.farmhunt.wins)}\`)\n**- Poop** (\`${f(acc.farmhunt.poop)}\`)`);
  embed.addField("Info", `**- AP** (\`${f(acc.arcadeAchievments.farmHunt.apEarned)} / ${f(acc.arcadeAchievments.farmHunt.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.farmhunt)}\`)`);

  return embed;
};