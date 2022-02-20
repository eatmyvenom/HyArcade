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
module.exports = function BountyHunters(acc, embed) {
  embed.addField(
    "Stats",
    `**- Wins** (\`${f(acc.bountyHunters.wins)}\`)\n**- Kills** (\`${f(acc.bountyHunters.kills)}\`)\n**- Bounty Kills** (\`${f(
      acc.bountyHunters.bountyKills,
    )}\`)\n**- Sword Kills** (\`${f(acc.bountyHunters.swordKills)}\`)\n**- Bow Kills** (\`${f(acc.bountyHunters.bowKills)}\`)\n**- Deaths** (\`${acc.bountyHunters.deaths}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.bountyHunters.apEarned)} / ${f(acc.arcadeAchievments.bountyHunters.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.blockingDead,
    )}\`)\n**- Total Points** (\`${f(acc.bountyHunters.bountyKills * 7 + acc.bountyHunters.kills)}\`)\n**- Kills/Deaths** (\`${f(
      ((acc.bountyHunters.kills + acc.bountyHunters.bountyKills) / acc.bountyHunters.deaths).toFixed(2),
    )}\`)\n**- Points/Deaths** (\`${f(((acc.bountyHunters.bountyKills * 7 + acc.bountyHunters.kills) / acc.bountyHunters.deaths).toFixed(2))}\`)`,
  );

  return embed;
};
