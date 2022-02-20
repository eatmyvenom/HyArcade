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
module.exports = function PartyGames(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.partyGames.wins)}\`)\n**- Rounds Won** (\`${f(acc.partyGames.roundsWon)}\`)\n**- Stars Earned** (\`${f(acc.partyGames.starsEarned)}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.partyGames.apEarned)} / ${f(acc.arcadeAchievments.partyGames.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.partyGames,
    )}\`)`,
  );

  embed.setFooter({ text: "Tip! For more detailed info use the /party-games command." });

  return embed;
};
