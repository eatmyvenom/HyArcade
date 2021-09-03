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
module.exports = function HoleInTheWall (acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.holeInTheWall.wins)}\`)\n**- Qualifiers** (\`${f(acc.holeInTheWall.qualifiers)}\`)\n**- Finals** (\`${f(acc.holeInTheWall.finals)}\`)\n**- Walls Completed** (\`${f(acc.holeInTheWall.rounds)}\`)`);
  embed.addField("Info", `**- AP** (\`${f(acc.arcadeAchievments.holeInTheWall.apEarned)} / ${f(acc.arcadeAchievments.holeInTheWall.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.holeInTheWall)}\`)\n**- Qualifiers+Finals** (\`${f(acc.holeInTheWall.finals + acc.holeInTheWall.qualifiers)}\`)`);

  return embed;
};