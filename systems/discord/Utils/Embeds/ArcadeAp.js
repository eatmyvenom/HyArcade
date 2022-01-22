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

/**
 * 
 * @param {object} acc 
 * @returns {string}
 */
function getTotal (acc) {

  const amount = acc.arcadeAchievments.totalEarned;
  const total = acc.arcadeAchievments.totalAvailiable;

  const ratio = Math.floor((amount / total) * 20);

  let value = "";
  value += `**\`[${"".padStart(ratio, "▬").padEnd(20)}]\`**\n`;
  value += `(\`${numberify(amount)} / ${numberify(total)}\`) points - \`${((amount / total) * 100).toFixed(2)}%\``;

  return value;
}

module.exports = function (acc, game) {

  if(game == undefined || game == "all") {
    return new MessageEmbed()
      .setTitle(`${acc.name}'s Arcade Achievements`)
      .setColor(0x8c54fe)
      .setDescription(`**Total Completion**\n${getTotal(acc)}\n\n`)
      .addField("General", getGame(acc.arcadeAchievments.overall), true)
      .addField("Blocking Dead", getGame(acc.arcadeAchievments.blockingDead), true)
      .addField("Bounty Hunters", getGame(acc.arcadeAchievments.bountyHunters), true)
      .addField("Capture the Wool", getGame(acc.arcadeAchievments.captureTheWool), true)
      .addField("Creeper Attack", getGame(acc.arcadeAchievments.creeperAttack), true)
      .addField("Dragon Wars", getGame(acc.arcadeAchievments.dragonWars), true)
      .addField("Ender Spleef", getGame(acc.arcadeAchievments.enderSpleef), true)
      .addField("Farm Hunt", getGame(acc.arcadeAchievments.farmHunt), true)
      .addField("Football", getGame(acc.arcadeAchievments.football), true)
      .addField("Galaxy Wars", getGame(acc.arcadeAchievments.galaxyWars), true)
      .addField("Hide and Seek", getGame(acc.arcadeAchievments.hideAndSeek), true)
      .addField("Hole in the Wall", getGame(acc.arcadeAchievments.holeInTheWall), true)
      .addField("Hypixel Says", getGame(acc.arcadeAchievments.hypixelSays), true)
      .addField("Mini Walls", getGame(acc.arcadeAchievments.miniWalls), true)
      .addField("Pixel Painters", getGame(acc.arcadeAchievments.pixelPainters), true)
      .addField("Party Games", getGame(acc.arcadeAchievments.partyGames), true)
      .addField("Throw Out", getGame(acc.arcadeAchievments.throwOut), true)
      .addField("Zombies", getGame(acc.arcadeAchievments.zombies), true);
  }

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