const { MessageEmbed } = require("discord.js");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify (n) {
  return Intl.NumberFormat("en").format(n);
}

/**
 * @param {object} ap
 * @returns {string}
 */
function getTiered (ap) {
  let value = "";

  value += `**${ap.name}**\n`;
  const total = ap.toTop + ap.amount;
  const amount = Math.min(total, ap.amount);

  const ratio = Math.floor((amount / total) * 15);

  value += "**- Completion **\n";
  value += `\`[${"".padStart(ratio, "▬").padEnd(15)}]\`\n`;
  value += `(\`${numberify(ap.amount)} / ${numberify(total)}\`)\n`;
  value += `**- Tier **(\`${ap.currentTier} / ${ap.topTier}\`)\n`;
  value += `**- To top tier** (\`${numberify(ap.toTop)}\`)\n`;
  value += `**- To next tier** (\`${numberify(ap.toNext)}\`)\n`;

  return value;
}

/**
 * @param {object} gameAp
 * @returns {string}
 */
function getAllTiered (gameAp) {
  let value = "";

  for(const ap of gameAp.tieredAP) {
    value += `${getTiered(ap)}\n`;
  }

  if(value == "") {
    value = "No Tiered availiable";
  }

  return value;
}

/**
 * 
 * @param {object} gameAp
 * @returns {string} 
 */
function getAllChallenge (gameAp) {
  let value = "";

  for(const ap of gameAp.achievementsEarned) {
    if(ap.name != undefined) {
      value += `\` +${ap.points.toString().padEnd(3)}\` ${ap.name}\n`;
    }
  }

  for(const ap of gameAp.achievementsMissing) {
    if(ap.name != undefined) {
      value += `\n\` -${ap.points.toString().padEnd(3)}\` ~~${ap.name}~~`;
    }
  }

  if(value == "") {
    value = "None";
  }

  return `**Challenges**\n${value}`;
}

/**
 * @param {object} ap
 * @returns {string}
 */
function getGame (ap) {
  let value = "";

  const total = ap.apAvailable;
  const amount = ap.apEarned;

  const ratio = Math.floor((amount / total) * 15);

  value += `\`[${"".padStart(ratio, "▬").padEnd(15)}]\`\n`;
  value += `(\`${numberify(amount)} / ${numberify(total)}\`) points`;

  return value;
}

module.exports = function (acc, game) {
  const overall = getGame(acc.arcadeAchievments[game]);
  const tiered = getAllTiered(acc.arcadeAchievments[game]);
  const challenge = getAllChallenge(acc.arcadeAchievments[game]);
  return new MessageEmbed()
    .setTitle(`${acc.name}'s Arcade Achievements`)
    .setColor(0x8c54fe)
    .addField("- Total Completion", overall)
    .addField("\u200B", tiered)
    .addField("\u200B", challenge);
};