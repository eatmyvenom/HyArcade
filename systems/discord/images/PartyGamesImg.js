const { MessageAttachment } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const ImageGenerator = require("./ImageGenerator");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n).toFixed(2));
  return r;
}

/**
 *
 * @param {number} time
 * @returns {string}
 */
function ms2time(time) {
  const date = new Date(time);

  return `${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
}

/**
 *
 * @param {Account} account
 * @param {string} game
 * @returns {MessageAttachment}
 */
async function generateImage(account, game) {
  const img = new ImageGenerator(1280, 800, "'myFont'", true);

  await img.addBackground("assets/blur.png", 0, 0, 1280, 800, "#00000064");

  await img.drawMcText(`&f${game} Stats`, 640, 40, 56, "center");
  await img.drawMcText(`${ImageGenerator.formatAcc(account)}`, img.canvas.width / 2, 110, 50, "center");

  let stat1 = "";
  let stat2 = "";
  let stat3 = "";
  let stat4 = "";
  let stat5 = "";
  let stat6 = "";

  switch (game) {
    case "Party Games": {
      stat1 = `Total Wins - ${numberify(account.partyGames.wins)}`;
      stat2 = `Rounds Won - ${numberify(account.partyGames.roundsWon ?? 0)}`;
      stat3 = `Stars Earned - ${numberify(account.partyGames.starsEarned ?? 0)}`;
      stat4 = `Wins 1 - ${numberify(account.partyGames.wins1)}`;
      stat5 = `Wins 2 - ${numberify(account.partyGames.wins2)}`;
      stat6 = `Wins 3 - ${numberify(account.partyGames.wins3)}`;
      break;
    }

    case "Animal Slaughter": {
      stat1 = `Wins - ${numberify(account.partyGames.animalSlaughterWins)}`;
      stat4 = `Total Kills - ${numberify(account.partyGames.animalSlaughterKills)}`;
      stat5 = `Best Score - ${numberify(account.partyGames.animalSlaughterPB)}`;
      break;
    }

    case "Anvil Spleef": {
      stat2 = `Wins - ${numberify(account.partyGames.anvilSpleefWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.anvilSpleefPB)}`;
      break;
    }

    case "Bombardment": {
      stat2 = `Wins - ${numberify(account.partyGames.bombardmentWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.bombardmentPB)}`;
      break;
    }

    case "Chicken Rings": {
      stat2 = `Wins - ${numberify(account.partyGames.chickenRingsWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.chickenRingsPB)}`;
      break;
    }

    case "Dive": {
      stat1 = `Wins - ${numberify(account.partyGames.diveWins)}`;
      stat4 = `Total Score - ${numberify(account.partyGames.diveScore)}`;
      stat5 = `Best Score - ${numberify(account.partyGames.divePB)}`;
      break;
    }

    case "High Ground": {
      stat1 = `Wins - ${numberify(account.partyGames.highGroundWins)}`;
      stat4 = `Total Score - ${numberify(account.partyGames.highGroundScore)}`;
      stat5 = `Best Score - ${numberify(account.partyGames.highGroundPB)}`;
      break;
    }

    case "Hoe Hoe Hoe": {
      stat1 = `Wins - ${numberify(account.partyGames.hoeWins)}`;
      stat4 = `Total Score - ${numberify(account.partyGames.hoeScore)}`;
      stat5 = `Best Score - ${numberify(account.partyGames.hoePB)}`;
      break;
    }

    case "Jigsaw Rush": {
      stat2 = `Wins - ${numberify(account.partyGames.jigsawWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.jigsawPB)}`;
      break;
    }

    case "Parkour": {
      stat1 = "Jungle Jump";
      stat2 = `Wins - ${numberify(account.partyGames.jungleJumpWins)}`;
      stat3 = `Best Time - ${ms2time(account.partyGames.jungleJumpPB)}`;
      stat4 = "The Floor is Lava";
      stat5 = `Wins - ${numberify(account.partyGames.theFloorIsLavaWins)}`;
      stat6 = `Best Time - ${ms2time(account.partyGames.theFloorIsLavaPB)}`;
      break;
    }

    case "Lab Escape": {
      stat2 = `Wins - ${numberify(account.partyGames.labEscapeWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.labEscapePB)}`;
      break;
    }

    case "Lawn Moower": {
      stat1 = `Wins - ${numberify(account.partyGames.lawnMoowerWins)}`;
      stat4 = `Total Score - ${numberify(account.partyGames.lawnMoowerScore)}`;
      stat5 = `Personal Best - ${numberify(account.partyGames.lawnMoowerPB)}`;
      break;
    }

    case "Minecart Racing": {
      stat2 = `Wins - ${numberify(account.partyGames.minecartRacingWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.minecartRacingPB)}`;
      break;
    }

    case "RPG-16": {
      stat1 = `Wins - ${numberify(account.partyGames.rpgWins)}`;
      stat4 = `Total Score - ${numberify(account.partyGames.rpgKills)}`;
      stat5 = `Best Score - ${numberify(account.partyGames.rpgPB)}`;
      break;
    }

    case "Spider Maze": {
      stat2 = `Wins - ${numberify(account.partyGames.spiderMazeWins)}`;
      stat5 = `Best Time - ${ms2time(account.partyGames.spiderMazePB)}`;
      break;
    }

    case "Avalanche": {
      stat2 = `Wins - ${numberify(account.partyGames.avalancheWins)}`;
      break;
    }

    case "Volcano": {
      stat2 = `Wins - ${numberify(account.partyGames.volcanoWins)}`;
      break;
    }

    case "Misc Pigs": {
      stat1 = "Pig Fishing";
      stat2 = `Wins - ${numberify(account.partyGames.pigFishingWins)}`;
      stat4 = "Pig Jousting";
      stat5 = `Wins - ${numberify(account.partyGames.pigJoustingWins)}`;
      break;
    }

    case "Trampolinio": {
      stat2 = `Wins - ${numberify(account.partyGames.trampolinioWins)}`;
      break;
    }

    case "Workshop": {
      stat2 = `Wins - ${numberify(account.partyGames.workshopWins)}`;
      break;
    }

    case "Shooting Range": {
      stat2 = `Wins - ${numberify(account.partyGames.shootingRangeWins)}`;
      break;
    }

    case "Frozen Floor": {
      stat2 = `Wins - ${numberify(account.partyGames.frozenFloorWins)}`;
      break;
    }

    case "Cannon Painting": {
      stat2 = `Wins - ${numberify(account.partyGames.cannonPaintingWins)}`;
      break;
    }

    case "Fire Leapers": {
      stat2 = `Wins - ${numberify(account.partyGames.fireLeapersWins)}`;
      break;
    }

    case "Super Sheep": {
      stat2 = `Wins - ${numberify(account.partyGames.superSheepWins)}`;
      break;
    }
  }

  if (stat1 != "") img.drawMcText(`&a${stat1}`, 320, 350, 48, "center");
  if (stat2 != "") img.drawMcText(`&b${stat2}`, 320, 450, 48, "center");
  if (stat3 != "") img.drawMcText(`&e${stat3}`, 320, 550, 48, "center");
  if (stat4 != "") img.drawMcText(`&a${stat4}`, 960, 350, 48, "center");
  if (stat5 != "") img.drawMcText(`&b${stat5}`, 960, 450, 48, "center");
  if (stat6 != "") img.drawMcText(`&e${stat6}`, 960, 550, 48, "center");

  return img.toDiscord();
}

module.exports = generateImage;
