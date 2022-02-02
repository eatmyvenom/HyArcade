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
 * @param {number} secs
 * @returns {string}
 */
function toHHMMSS(secs) {
  const sec_num = Number.parseInt(secs, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

/**
 *
 * @param {Account} acc
 * @param {MessageEmbed} embed
 * @returns {MessageEmbed}
 */
module.exports = function Zombies(acc, embed) {
  embed.addField(
    "Stats",
    `**- Total Wins** (\`${f(acc?.zombies?.wins_zombies ?? 0)}\`)\n**- Bad Blood Wins** (\`${f(acc?.zombies?.wins_zombies_badblood ?? 0)}\`)\n**- Dead End Wins** (\`${f(
      acc?.zombies?.wins_zombies_deadend ?? 0,
    )}\`)\n**- Alien Arcadium Wins** (\`${f(acc?.zombies?.wins_zombies_alienarcadium ?? 0)}\`)`,
  );
  embed.addField(
    "Info",
    `**- AP** (\`${f(acc.arcadeAchievments.zombies.apEarned)} / ${f(acc.arcadeAchievments.zombies.apAvailable)}\`)\n**- Challenges** (\`${f(
      acc.arcadeChallenges.zombies,
    )}\`)\n**- Fastest win** (\`${toHHMMSS(
      Math.min(
        acc.zombies?.fastest_time_30_zombies_badblood_normal ?? 99999,
        acc.zombies?.fastest_time_30_zombies_deadend_normal ?? 99999,
        acc.zombies?.fastest_time_30_zombies_alienarcadium_normal ?? 99999,
      ),
    )}\`)`,
  );

  embed.setFooter("Tip! For more detailed info use the /zombies command.");

  return embed;
};
