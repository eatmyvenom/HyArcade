const { MessageEmbed } = require("discord.js");
const Achievements = require("hyarcade-structures/Achievements");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  return Intl.NumberFormat("en").format(n);
}

/**
 * @param {object} ap
 * @returns {string}
 */
function getTiered(ap) {
  let value = "";

  value += `**${ap.name}**\n`;
  const total = ap.toTop + ap.amount;
  value += `(\`${numberify(ap.amount)} / ${numberify(total)}\`)\n`;

  return value;
}

/**
 * @param {object} gameAp
 * @returns {string}
 */
function getAllTiered(gameAp) {
  let value = "";

  for (const ap of gameAp.tieredAP) {
    if (ap.toTop > 0) {
      value += `${getTiered(ap)}\n`;
    }
  }

  if (value == "") {
    value = "No Tiered availiable";
  }

  return `${value}`.slice(0, 1024);
}

/**
 *
 * @param {object} gameAp
 * @returns {string}
 */
function getAllChallenge(gameAp) {
  let value = "";

  gameAp.achievementsMissing.sort((a, b) => {
    b.points - a.points;
  });

  for (const ap of gameAp.achievementsMissing) {
    if (ap.challenge) {
      value += `\n\`-${ap.points.toString().padEnd(2)}\` ~~${ap.name}~~`;
    }
  }

  if (value == "") {
    value = "None";
  }

  return `${value}`.slice(0, 1024);
}

/**
 * @param {object} ap
 * @returns {string}
 */
function getGame(ap) {
  let value = "";

  const total = ap.apAvailable;
  const amount = ap.apEarned;

  const ratio = Math.floor((amount / total) * 18);

  value += `\`[${"".padStart(ratio, "▬").padEnd(18)}]\`\n`;
  value += `(\`${numberify(amount)} / ${numberify(total)}\`) points`;

  return value;
}

/**
 *
 * @param {Achievements} acc
 * @returns {string}
 */
function getTotal(acc) {
  const amount = acc.totalEarned;
  const total = acc.totalAvailiable;

  const ratio = Math.floor((amount / total) * 20);

  let value = "";
  value += `**\`[${"".padStart(ratio, "▬").padEnd(20)}]\`**\n`;
  value += `(\`${numberify(amount)} / ${numberify(total)}\`) points - \`${((amount / total) * 100).toFixed(2)}%\``;

  return value;
}

/**
 *
 * @param {Achievements} acc
 * @param {string} game
 * @returns {MessageEmbed}
 */
module.exports = function (acc, game) {
  if (game == undefined || game == "all") {
    return new MessageEmbed()
      .setTitle(`${acc.name}'s Achievements`)
      .setColor(0x8c54fe)
      .setDescription(`**Total Completion**\n${getTotal(acc)}\n\n`);
  }

  const overall = getGame(acc[game]);
  const tiered = getAllTiered(acc[game]);
  const challenge = getAllChallenge(acc[game]);
  return new MessageEmbed()
    .setTitle(`${acc.name}'s Achievements`)
    .setColor(0x8c54fe)
    .addField("- Total Completion", overall)
    .addField("Tiered", tiered, true)
    .addField("Challenges", challenge, true);
};
