const { MessageEmbed } = require("discord.js");
const { Account } = require("@hyarcade/structures");
const EmojiGetter = require("../Formatting/EmojiGetter");

/**
 * @param {number} n
 * @returns {number}
 */
function formatRatio(n) {
  const r = Math.round(n * 1000) / 1000;
  return r;
}

/**
 * @param {string} str
 * @returns {string}
 */
function formatNumber(str) {
  const r = Intl.NumberFormat("en").format(Number(str));
  return r;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {boolean} hasPerms
 * @returns {string}
 */
function renderColor(stat1, stat2, hasPerms) {
  if (stat1 > stat2) {
    return EmojiGetter(hasPerms, "better");
  } else if (stat1 == stat2) {
    return EmojiGetter(hasPerms, "neutral");
  }
  return EmojiGetter(hasPerms, "worse");
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineNumber(stat1, stat2, name, hasPerms) {
  return `${renderColor(stat1, stat2, hasPerms)} **${name}** - (\`${formatNumber(stat1)}\`) | (\`${formatNumber(stat2)}\`)\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineNumberInverse(stat1, stat2, name, hasPerms) {
  return `${renderColor(stat2, stat1, hasPerms)} **${name}** - (\`${formatNumber(stat1)}\`) | (\`${formatNumber(stat2)}\`)\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function lineRatio(stat1, stat2, name, hasPerms) {
  return `${renderColor(stat1, stat2, hasPerms)} ${name}\n${formatRatio(stat1)} | ${formatRatio(stat2)}\n`;
}

/**
 *
 * @param {Account} acc1
 * @param {Account} acc2
 * @param {string} game
 * @param {boolean} hasPerms
 * @returns {MessageEmbed}
 */
function renderComparator(acc1, acc2, game, hasPerms) {
  const embed = new MessageEmbed().setTitle(`${acc1.name} vs ${acc2.name}`).setColor(0xbb00dd);

  let str = "";
  let gameName;

  switch (game.toLowerCase()) {
    case "12":
    case "party":
    case "partygames":
    case "pg": {
      gameName = "Party Games";
      str += lineNumber(acc1?.partyGames?.wins, acc2?.partyGames?.wins, "Wins", hasPerms);
      break;
    }

    case "fh":
    case "farm":
    case "fmhnt":
    case "farmhunt":
    case "5":
    case "frmhnt": {
      gameName = "Farm Hunt";
      str += lineNumber(acc1?.farmhunt?.wins, acc2?.farmhunt?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.farmhunt?.poop, acc2?.farmhunt?.poop, "Poop", hasPerms);
      break;
    }

    case "10":
    case "hs":
    case "hys":
    case "hypixel":
    case "says":
    case "hysays": {
      gameName = "Hypixel Says";
      str += lineNumber(acc1?.hypixelSays?.wins, acc2?.hypixelSays?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.hypixelSays?.rounds, acc2?.hypixelSays?.rounds, "Points", hasPerms);
      break;
    }

    case "8":
    case "hitw":
    case "hit":
    case "hole":
    case "pain": {
      gameName = "Hole in the Wall";
      str += lineNumber(acc1?.holeInTheWall?.wins, acc2?.holeInTheWall?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.holeInTheWall?.rounds, acc2?.holeInTheWall?.rounds, "Walls", hasPerms);
      str += lineNumber(acc1?.holeInTheWall?.qualifiers, acc2?.holeInTheWall?.qualifiers, "Qualifiers", hasPerms);
      str += lineNumber(acc1?.holeInTheWall?.finals, acc2?.holeInTheWall?.finals, "Finals", hasPerms);
      break;
    }

    case "11":
    case "mw":
    case "miw":
    case "mini":
    case "mwall":
    case "wall":
    case "pvp":
    case "miniwalls": {
      gameName = "Mini Walls";
      str += lineNumber(acc1?.miniWalls?.wins, acc2?.miniWalls?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.miniWalls?.kills, acc2?.miniWalls?.kills, "Kills", hasPerms);
      str += lineNumber(acc1?.miniWalls?.finalKills, acc2?.miniWalls?.finalKills, "Final Kills", hasPerms);
      str += lineNumberInverse(acc1?.miniWalls?.deaths, acc2?.miniWalls?.deaths, "Deaths", hasPerms);
      str += lineNumber(acc1?.miniWalls?.witherDamage, acc2?.miniWalls?.witherDamage, "Wither Damage", hasPerms);
      str += lineNumber(acc1?.miniWalls?.witherKills, acc2?.miniWalls?.witherKills, "Wither Kills", hasPerms);
      break;
    }

    case "6":
    case "sc":
    case "fb":
    case "foot":
    case "ballin":
    case "fuck":
    case "shit":
    case "football": {
      gameName = "Football";
      str += lineNumber(acc1?.football?.wins, acc2?.football?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.football?.goals, acc2?.football?.goals, "Goals", hasPerms);
      str += lineNumber(acc1?.football?.kicks, acc2?.football?.kicks, "Kicks", hasPerms);
      str += lineNumber(acc1?.football?.powerkicks, acc2?.football?.powerkicks, "Power Kicks", hasPerms);
      break;
    }

    case "4":
    case "es":
    case "spleeg":
    case "ender":
    case "enderman":
    case "trash":
    case "enderspleef": {
      gameName = "Ender Spleef";
      str += lineNumber(acc1?.enderSpleef?.wins, acc2?.enderSpleef?.wins, "Wins", hasPerms);
      break;
    }

    case "15":
    case "to":
    case "throw":
    case "toss":
    case "sumo2":
    case "throwout": {
      gameName = "Throw Out";
      str += lineNumber(acc1?.throwOut?.wins, acc2?.throwOut?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.throwOut?.kills, acc2?.throwOut?.kills, "Kills", hasPerms);
      str += lineNumberInverse(acc1?.throwOut?.deaths, acc2?.throwOut?.deaths, "Deaths", hasPerms);
      break;
    }

    case "7":
    case "gw":
    case "sw":
    case "galaxy":
    case "galaxywars": {
      gameName = "Galaxy Wars";
      str += lineNumber(acc1?.galaxyWars?.wins, acc2?.galaxyWars?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.galaxyWars?.kills, acc2?.galaxyWars?.kills, "Kills", hasPerms);
      str += lineNumberInverse(acc1?.galaxyWars?.deaths, acc2?.galaxyWars?.deaths, "Deaths", hasPerms);
      break;
    }

    case "3":
    case "dw":
    case "dragon":
    case "wagon":
    case "dragonwar":
    case "dragwar":
    case "dragonwars": {
      gameName = "Dragon Wars";
      str += lineNumber(acc1?.dragonWars?.wins, acc2?.dragonWars?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.dragonWars?.kills, acc2?.dragonWars?.kills, "Kills", hasPerms);
      break;
    }

    case "2":
    case "bh":
    case "bnt":
    case "one":
    case "bounty":
    case "oneinthequiver":
    case "bountyhunters": {
      gameName = "Bounty Hunters";
      str += lineNumber(acc1?.bountyHunters?.wins, acc2?.bountyHunters?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.bountyHunters?.kills, acc2?.bountyHunters?.kills, "Kills", hasPerms);
      str += lineNumber(acc1?.bountyHunters?.bountyKills, acc2?.bountyHunters?.bountyKills, "Bounty Kills", hasPerms);
      str += lineNumberInverse(acc1?.bountyHunters?.deaths, acc2?.bountyHunters?.deaths, "Deaths", hasPerms);
      break;
    }

    case "1":
    case "bd":
    case "do":
    case "dayone":
    case "blocking":
    case "blockingdead": {
      gameName = "Blocking Dead";
      str += lineNumber(acc1?.blockingDead?.wins, acc2?.blockingDead?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.blockingDead?.kills, acc2?.blockingDead?.kills, "Kills", hasPerms);
      str += lineNumber(acc1?.blockingDead?.headshots, acc2?.blockingDead?.headshots, "Headshots", hasPerms);
      break;
    }

    case "9":
    case "has":
    case "hide":
    case "h&s":
    case "hns":
    case "probotkeptspammingthisshit":
    case "hideandseek":
    case "hidenseek":
    case "hideseek": {
      gameName = "Hide and Seek";
      str += lineNumber(acc1?.hideAndSeek?.wins, acc2?.hideAndSeek?.wins, "Wins", hasPerms);
      str += lineNumber(acc1?.hideAndSeek?.kills, acc2?.hideAndSeek?.kills, "Kills", hasPerms);
      str += lineNumber(acc1?.hideAndSeek?.hiderWins, acc2?.hideAndSeek?.hiderWins, "Hider Wins", hasPerms);
      str += lineNumber(acc1?.hideAndSeek?.seekerWins, acc2?.hideAndSeek?.seekerWins, "Seeker Wins", hasPerms);
      break;
    }

    case "16":
    case "z":
    case "zs":
    case "zbs":
    case "zomb":
    case "zbies":
    case "zombies": {
      gameName = "Zombies";
      str += lineNumber(acc1?.zombies?.wins_zombies, acc2?.zombies?.wins_zombies, "Wins", hasPerms);
      break;
    }

    case "ctw":
    case "ctwool":
    case "capkills":
    case "capture":
    case "capwool":
    case "ctwwool":
    case "ctwwoolcaptured":
    case "ctwkills": {
      gameName = "Capture the Wool";
      str += lineNumber(acc1?.captureTheWool?.kills, acc2?.captureTheWool?.kills, "Kills", hasPerms);
      str += lineNumber(acc1?.captureTheWool?.woolCaptures, acc2?.captureTheWool?.woolCaptures, "Wool Captured", hasPerms);
      break;
    }

    case "13":
    case "pp":
    case "draw":
    case "pixpaint":
    case "pixelpaint":
    case "pixelpainters":
    case "drawmything":
    case "drawtheirthing":
    case "drawing": {
      gameName = "Pixel Painters";
      str += lineNumber(acc1?.pixelPainters?.wins, acc2?.pixelPainters?.wins, "Wins", hasPerms);
      break;
    }

    case "all": {
      gameName = "All Games";
      str += lineNumber(acc1?.blockingDead?.wins, acc2?.blockingDead?.wins, "Blocking Dead", hasPerms);
      str += lineNumber(acc1?.bountyHunters?.wins, acc2?.bountyHunters?.wins, "Bounty Hunters", hasPerms);
      str += lineNumber(acc1?.dragonWars?.wins, acc2?.dragonWars?.wins, "Dragon Wars", hasPerms);
      str += lineNumber(acc1?.enderSpleef?.wins, acc2?.enderSpleef?.wins, "Ender Spleef", hasPerms);
      str += lineNumber(acc1?.farmhunt?.wins, acc2?.farmhunt?.wins, "Farm Hunt", hasPerms);
      str += lineNumber(acc1?.football?.wins, acc2?.football?.wins, "Football", hasPerms);
      str += lineNumber(acc1?.galaxyWars?.wins, acc2?.galaxyWars?.wins, "Galaxy Wars", hasPerms);
      str += lineNumber(acc1?.hideAndSeek?.wins, acc2?.hideAndSeek?.wins, "Hide and Seek", hasPerms);
      str += lineNumber(acc1?.holeInTheWall?.wins, acc2?.holeInTheWall?.wins, "Hole in the Wall", hasPerms);
      str += lineNumber(acc1?.hypixelSays?.wins, acc2?.hypixelSays?.wins, "Hypixel Says", hasPerms);
      str += lineNumber(acc1?.miniWalls?.wins, acc2?.miniWalls?.wins, "Mini Walls", hasPerms);
      str += lineNumber(acc1?.partyGames?.wins, acc2?.partyGames?.wins, "Party Games", hasPerms);
      str += lineNumber(acc1?.pixelPainters?.wins, acc2?.pixelPainters?.wins, "Pixel Painters", hasPerms);
      str += lineNumber(acc1?.seasonalWins?.total, acc2?.seasonalWins?.total, "Seasonal Games", hasPerms);
      str += lineNumber(acc1?.throwOut?.wins, acc2?.throwOut?.wins, "Throw Out", hasPerms);
      str += lineNumber(acc1?.zombies?.wins_zombies, acc2?.zombies?.wins_zombies, "Zombies", hasPerms);
      break;
    }

    default: {
      gameName = "Overall";
      str += lineNumber(acc1?.arcadeWins, acc2?.arcadeWins, "Arcade Wins", hasPerms);
      str += lineNumber(acc1?.combinedArcadeWins, acc2?.combinedArcadeWins, "Combined Arcade Wins", hasPerms);
      str += lineNumber(acc1?.arcadeAchievments?.totalEarned, acc2?.arcadeAchievments?.totalEarned, "Arcade AP", hasPerms);
      str += lineNumber(acc1?.achievementPoints, acc2?.achievementPoints, "AP", hasPerms);
      str += lineNumber(acc1?.karma, acc2?.karma, "Karma", hasPerms);
    }
  }

  embed.setDescription(`**${gameName}**\n${str}`);

  return embed;
}

module.exports = renderComparator;
