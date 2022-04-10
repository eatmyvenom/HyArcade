import { Account } from "@hyarcade/account";
import Database from "@hyarcade/database";
import { ImageGenerator } from "@hyarcade/images";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import GetAsset from "@hyarcade/utils/FileHandling/GetAsset.js";
import StatsMenu from "../interactions/Components/Menus/Generators/StatsMenu.js";
import AccountComparitor from "../Utils/AccountComparitor.js";
import { ERROR_WAS_NOT_IN_DATABASE } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

/**
 * @param {Account} account
 * @param {string} game
 * @returns {*}
 */
// eslint-disable-next-line complexity
async function genImg(account, game = "") {
  const img = new ImageGenerator(3000, 1800, "'minecraft'", true);
  const startY = 600;
  const lineHeight = 110;
  const spacer = 75;
  const x = 800;
  const txtSize = 96;
  const size = 112;

  switch (`${game}`.toLowerCase()) {
    case "12":
    case "party":
    case "partygames":
    case "pg": {
      await img.addBackground(GetAsset("status/Arcade-party-games-1.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(32);

      img.drawMcText("Party Games", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.partyGames.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bStars Earned", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.partyGames.starsEarned)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eRounds Won", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.partyGames.roundsWon)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&aAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&a${account.arcadeAchievments.partyGames.apEarned} / ${account.arcadeAchievments.partyGames.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.partyGames)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "fh":
    case "farm":
    case "fmhnt":
    case "farmhunt":
    case "5":
    case "frmhnt": {
      await img.addBackground(GetAsset("status/Arcade-farm-hunt-3.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Farm Hunt", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.farmhunt.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bTotal Kills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.farmhunt.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eTaunts Used", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.farmhunt.tauntsUsed)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.farmHunt.apEarned} / ${account.arcadeAchievments.farmHunt.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.farmhunt)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "10":
    case "hs":
    case "hys":
    case "hypixel":
    case "says":
    case "hysays": {
      await img.addBackground(GetAsset("status/Arcade-hypixel-says.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Hypixel Says", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.hypixelSays.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bTotal Points", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.hypixelSays.totalPoints)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bMax Score", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.hypixelSays.maxScore)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eRound Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.hypixelSays.totalRoundWins)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.hypixelSays.apEarned} / ${account.arcadeAchievments.hypixelSays.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.hypixelSays)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "8":
    case "hitw":
    case "hit":
    case "hole":
    case "pain": {
      await img.addBackground(GetAsset("status/Arcade-hole-in-the-wall-2.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Hole in the Wall", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.holeInTheWall.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bBest Qualifiers", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.holeInTheWall.qualifiers)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bBest Finals", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.holeInTheWall.finals)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eWalls Completed", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.holeInTheWall.rounds)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.holeInTheWall.apEarned} / ${account.arcadeAchievments.holeInTheWall.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.holeInTheWall)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bCombined Score", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&b${numberify(account.holeInTheWall.finals + account.holeInTheWall.qualifiers)}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      return img;
    }

    case "11":
    case "mw":
    case "miw":
    case "mini":
    case "mwall":
    case "wall":
    case "pvp":
    case "miniwalls": {
      await img.addBackground(GetAsset("miwblur2.png"), -500, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Mini Walls", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&fTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&f${numberify(account.miniWalls.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eKills &7(Kills - Finals)", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${numberify(account.miniWalls.kills)} - ${numberify(account.miniWalls.finalKills)}`,
        x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&aWither &7(Damage - Kills)", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&a${numberify(account.miniWalls.witherDamage)} - ${numberify(account.miniWalls.witherKills)}`,
        x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&bArrows &7(Shot - Hit)", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&b${numberify(account.miniWalls.arrowsShot)} - ${numberify(account.miniWalls.arrowsHit)}`,
        x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&cDeaths", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&c${numberify(account.miniWalls.deaths)}`, x, (y += lineHeight), size, "center");

      y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&fAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&f${account.arcadeAchievments.miniWalls.apEarned} / ${account.arcadeAchievments.miniWalls.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&eTotal Kills/Deaths", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${((account.miniWalls.kills + account.miniWalls.finalKills) / account.miniWalls.deaths).toFixed(2)}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&aWither Damage/Deaths", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&a${(account.miniWalls.witherDamage / account.miniWalls.deaths).toFixed(2)}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&bArrow Accuracy", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&b${((account.miniWalls.arrowsHit / account.miniWalls.arrowsShot) * 100).toFixed(2)}%`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.miniWalls)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "6":
    case "sc":
    case "fb":
    case "foot":
    case "ballin":
    case "fuck":
    case "shit":
    case "football": {
      await img.addBackground(GetAsset("status/Arcade-football-3.png"), 0, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Football", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.football.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bGoals", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.football.goals)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKicks", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.football.kicks)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&ePower Kicks", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.football.powerkicks)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.football.apEarned} / ${account.arcadeAchievments.football.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.football)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "4":
    case "es":
    case "endspleef":
    case "spleef":
    case "endermanspleef":
    case "anriespleef":
    case "anrie":
    case "spleeg":
    case "ender":
    case "enderman":
    case "trash":
    case "enderspleef": {
      await img.addBackground(GetAsset("status/Arcade-ender-spleef.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Ender Spleef", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.enderSpleef.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bBlocks Broken", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.enderSpleef.blocksBroken)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&ePowerups Used", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.enderSpleef.totalPowerups)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.enderSpleef.apEarned} / ${account.arcadeAchievments.enderSpleef.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.enderSpleef)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "15":
    case "to":
    case "throw":
    case "toss":
    case "sumo2":
    case "throwout": {
      await img.addBackground(GetAsset("status/Arcade-throw-out.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Throw Out", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.throwOut.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.throwOut.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eDeaths", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.throwOut.deaths)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.throwOut.apEarned} / ${account.arcadeAchievments.throwOut.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.throwOut)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKills / Deaths", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&b${(account.throwOut.kills / account.throwOut.deaths).toFixed(2)}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      return img;
    }

    case "7":
    case "gw":
    case "sw":
    case "galaxy":
    case "galaxywars": {
      await img.addBackground(GetAsset("status/Arcade-galaxy-wars.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Galaxy Wars", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.galaxyWars.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.galaxyWars.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eDeaths", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.galaxyWars.deaths)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.galaxyWars.apEarned} / ${account.arcadeAchievments.galaxyWars.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.galaxyWars)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKills / Deaths", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&b${(account.galaxyWars.kills / account.galaxyWars.deaths).toFixed(2)}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      return img;
    }

    case "3":
    case "dw":
    case "dragon":
    case "dragonwars": {
      await img.addBackground(GetAsset("status/Arcade-dragon-wars.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Dragon Wars", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.dragonWars.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bKills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.dragonWars.kills)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.dragonWars.apEarned} / ${account.arcadeAchievments.dragonWars.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.dragonWars)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "2":
    case "bh":
    case "bnt":
    case "one":
    case "bounty":
    case "oneinthequiver":
    case "bountyhunters": {
      await img.addBackground(GetAsset("status/Arcade-bounty-hunters-3.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Bounty Hunters", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.bountyHunters.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bTotal Kills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.bountyHunters.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bTotal Deaths", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.bountyHunters.deaths)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.bountyHunters.apEarned} / ${account.arcadeAchievments.bountyHunters.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.bountyHunters)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "1":
    case "bd":
    case "do":
    case "dayone":
    case "blocking":
    case "blockingdead": {
      await img.addBackground(GetAsset("status/Arcade-blocking-dead.png"), -500, 0, 4000, 2040, "#0000007F");
      await img.blur(32);

      img.drawMcText("Blocking Dead", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.blockingDead.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bZombie Kills", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.blockingDead.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eHeadshots", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.blockingDead.headshots)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.blockingDead.apEarned} / ${account.arcadeAchievments.blockingDead.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.blockingDead)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
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
      await img.addBackground(GetAsset("status/Arcade-hide-and-seek-party-pooper-1.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(48);

      img.drawMcText("Hide and Seek", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.hideAndSeek.wins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bHider Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.hideAndSeek.hiderWins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eSeeker Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.hideAndSeek.seekerWins)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.hideAndSeek.apEarned} / ${account.arcadeAchievments.hideAndSeek.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.hideAndSeek)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bObjectives", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.hideAndSeek.objectives)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&aTotal Kills", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.hideAndSeek.kills)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "16":
    case "z":
    case "zs":
    case "zbs":
    case "zomb":
    case "zbies":
    case "zombies": {
      await img.addBackground(GetAsset("status/Arcade-zombies-dead-end.png"), 0, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Zombies", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&aTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.zombies.wins_zombies ?? 0)}`, x, (y += lineHeight), size, "center");
      y += spacer;

      img.drawMcText("&bBad Blood Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.zombies.wins_zombies_badblood ?? 0)}`, x, (y += lineHeight), size, "center");
      y += spacer;

      img.drawMcText("&bDead End Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.zombies.wins_zombies_deadend ?? 0)}`, x, (y += lineHeight), size, "center");
      y += spacer;

      img.drawMcText("&eAlien Arcadium Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.zombies.wins_zombies_alienarcadium ?? 0)}`, x, (y += lineHeight), size, "center");
      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.zombies.apEarned} / ${account.arcadeAchievments.zombies.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );
      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.zombies)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "ctw":
    case "ctwool":
    case "capkills":
    case "capture":
    case "capwool":
    case "ctwwool":
    case "ctwwoolcaptured":
    case "ctwkills": {
      await img.addBackground(GetAsset("status/Arcade-capture-the-wool-3.png"), -500, 0, 4000, 2040, "#0000006F");
      await img.blur(48);

      img.drawMcText("Capture the Wool", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aKills + Assists", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.captureTheWool.kills)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bWool Captured", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.captureTheWool.woolCaptures)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.captureTheWool.apEarned} / ${account.arcadeAchievments.captureTheWool.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.captureTheWool)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
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
      await img.addBackground(GetAsset("status/Arcade-pixel-painters.png"), -500, 0, 4000, 2040, "#0000006F");
      await img.blur(48);

      img.drawMcText("Pixel Painters", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY;

      img.drawMcText("&aWins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.pixelPainters.wins)}`, x, (y += lineHeight), size, "center");
      y = startY;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.pixelPainters.apEarned} / ${account.arcadeAchievments.pixelPainters.apAvailable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dChallenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&d${numberify(account.arcadeChallenges.pixelPainters)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    case "sim":
    case "simulator":
    case "seasonal":
    case "season":
    case "14":
    case "sea": {
      await img.addBackground(GetAsset("arcblur11.png"), -500, 0, 4000, 2040, "#0000006F");
      await img.blur(16);

      img.drawMcText("Seasonal Games", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&fTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&f${numberify(account.seasonalWins.total)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eEaster Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.seasonalWins.easter)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&aGrinch Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.seasonalWins.grinch)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bHalloween Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.seasonalWins.halloween)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eScuba Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.seasonalWins.scuba)}`, x, (y += lineHeight), size, "center");

      y = startY;

      img.drawMcText("&eEaster Found", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.seasonalWins.foundEaster)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&bHalloween Found", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&b${numberify(account.seasonalWins.foundHalloween)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eScuba Points", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.seasonalWins.foundScuba)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }

    default: {
      await img.addBackground(GetAsset("arcblur9.png"), -250, -100, 4000, 2040, "#0000008F");
      await img.blur(16);

      img.drawMcText("Overall Arcade", img.canvas.width / 2, 100, 124, "center");
      img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 220, 124, "center");

      let y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&fTotal Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&f${numberify(account.arcadeWins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&fCombined Wins", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&f${numberify(account.combinedArcadeWins)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&aGamer Quest", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.quests.arcadeGamer)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&aWinner Quest", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.quests.arcadeWinner)}`, x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&aSpecialist Quest", x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&a${numberify(account.quests.arcadeSpecialist)}`, x, (y += lineHeight), size, "center");

      y = startY - lineHeight - lineHeight - spacer;

      img.drawMcText("&eAchievements", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&e${account.arcadeAchievments.totalEarned} / ${account.arcadeAchievments.totalAvailiable}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&dTotal Challenges", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&d${numberify(Object.values(account.arcadeChallenges).reduce((p, c) => p + c, 0))}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&aTotal Quests", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(
        `&a${numberify(Object.values(account.quests).reduce((p, c) => p + c, 0))}`,
        img.canvas.width - x,
        (y += lineHeight),
        size,
        "center",
      );

      y += spacer;

      img.drawMcText("&eArcade Coins", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(Math.floor(account.arcadeCoins ?? 0))}`, img.canvas.width - x, (y += lineHeight), size, "center");

      y += spacer;

      img.drawMcText("&eCoins Earned", img.canvas.width - x, (y += lineHeight), txtSize, "center");
      img.drawMcText(`&e${numberify(account.coinsEarned)}`, img.canvas.width - x, (y += lineHeight), size, "center");

      return img;
    }
  }
}

/**
 *
 * @param {string} ign
 * @returns {CommandResponse}
 */
function nonDatabaseError(ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

export default new Command(
  ["stats", "s", "stat"],
  ["*"],
  async (args, rawMsg, interaction) => {
    const plr = args[0] ?? "!";
    const game = args[1];
    let time = args[2] ?? "lifetime";

    switch (time.toLowerCase()) {
      case "d":
      case "day":
      case "dae":
      case "daily":
      case "today": {
        time = "day";
        break;
      }

      case "w":
      case "week":
      case "weak":
      case "weekly":
      case "weeekly": {
        time = "weekly";
        break;
      }

      case "m":
      case "monthly":
      case "month":
      case "mnth":
      case "mnthly":
      case "mon": {
        time = "monthly";
        break;
      }

      default: {
        time = "lifetime";
      }
    }

    let acc;
    let res;
    if (interaction == undefined) {
      res = await Database.timedAccount(plr, rawMsg.author.id, time);
    } else {
      if (interaction.isButton()) {
        await interaction.deferUpdate();
        res = await Database.timedAccount(plr, "", time);
      } else if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
        res = await Database.timedAccount(plr, "", time);
      } else {
        await interaction.deferReply();
        res = await Database.timedAccount(interaction.options.getString("player"), interaction.user.id, time);
      }
    }

    if (time == "lifetime") {
      acc = res;
    } else {
      if (res?.timed == undefined) {
        return nonDatabaseError(res?.acc?.name ?? "INVALID-NAME");
      }
      acc = AccountComparitor(res?.acc, res?.timed);
    }

    if (acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_IGN_UNDEFINED);

    const img = await genImg(acc, game);
    const menu = StatsMenu(acc.uuid, time, game ?? "undefined");

    return new CommandResponse("", undefined, await img.toDiscord(), menu);
  },
  2500,
);
