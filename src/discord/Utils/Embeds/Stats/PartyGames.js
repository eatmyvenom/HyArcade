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
module.exports = function PartyGames (acc, embed) {
  embed.addField("Stats", `**- Wins** (\`${f(acc.partyGames.wins)}\`)\n**- Wins 1** (\`${f(acc.partyGames.wins1)}\`)\n**- Wins 2** (\`${f(acc.partyGames.wins2)}\`)\n**- Wins 3** (\`${f(acc.partyGames.wins3)}\`)`);
  embed.addField("Info", `**- AP** (\`${f(acc.arcadeAchievments.partyGames.apEarned)} / ${f(acc.arcadeAchievments.partyGames.apAvailable)}\`)\n**- Challenges** (\`${f(acc.arcadeChallenges.partyGames)}\`)`);

  return embed;
};