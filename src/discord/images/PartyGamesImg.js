const { MessageAttachment } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const ImageGenerator = require("./ImageGenerator");

/**
 * 
 * @param {Account} account
 * @param {string} game
 * @returns {MessageAttachment}
 */
async function generateImage (account, game) {
  const img = new ImageGenerator(1280, 800, "'myFont'");

  await img.addBackground("resources/blur.png", 0, 0, 1280, 800, "#00000044");

  await img.writeText(`${game} Stats`, 640, 40, "center", "#FFFFFF", "54px");
  await img.writeAcc(account, undefined, 100, "48px");

  let stat1 = "";
  let stat2 = "";
  let stat3 = "";
  let stat4 = "";
  let stat5 = "";
  let stat6 = "";

  switch (game) {
  case "Party Games" : {
    stat1 = `Total Wins - ${account.partyGames.wins}`;
    stat2 = `Rounds Won - ${account.partyGames.roundsWon ?? 0}`;
    stat3 = `Stars Earned - ${account.partyGames.starsEarned ?? 0}`;
    stat4 = `Wins 1 - ${account.partyGames.wins1}`;
    stat5 = `Wins 2 - ${account.partyGames.wins2}`;
    stat6 = `Wins 3 - ${account.partyGames.wins3}`;
    break;
  }

  case "Animal Slaughter" : {
    stat1 = `Wins - ${account.partyGames.animalSlaughterWins}`;
    stat4 = `Total Kills - ${account.partyGames.animalSlaughterKills}`;
    stat5 = `Personal Best - ${account.partyGames.animalSlaughterPB}`;
    break;
  }

  case "Anvil Spleef" : {
    stat2 = `Wins - ${account.partyGames.anvilSpleefWins}`;
    stat5 = `Personal Best - ${account.partyGames.anvilSpleefPB}`;
    break;
  }

  case "Bombardment" : {
    stat2 = `Wins - ${account.partyGames.bombardmentWins}`;
    stat5 = `Personal Best - ${account.partyGames.bombardmentPB}`;
    break;
  }

  case "Chicken Rings" : {
    stat2 = `Wins - ${account.partyGames.chickenRingsWins}`;
    stat5 = `Personal Best - ${account.partyGames.chickenRingsPB}`;
    break;
  }

  case "Dive" : {
    stat1 = `Wins - ${account.partyGames.diveWins}`;
    stat4 = `Total Score - ${account.partyGames.diveScore}`;
    stat5 = `Personal Best - ${account.partyGames.divePB}`;
    break;
  }

  case "High Ground" : {
    stat1 = `Wins - ${account.partyGames.highGroundWins}`;
    stat4 = `Total Score - ${account.partyGames.highGroundScore}`;
    stat5 = `Personal Best - ${account.partyGames.highGroundPB}`;
    break;
  }

  case "Hoe Hoe Hoe" : {
    stat1 = `Wins - ${account.partyGames.hoeWins}`;
    stat4 = `Total Score - ${account.partyGames.hoeScore}`;
    stat5 = `Personal Best - ${account.partyGames.hoePB}`;
    break;
  }

  case "Jigsaw Rush" : {
    stat2 = `Wins - ${account.partyGames.jigsawWins}`;
    stat5 = `Personal Best - ${account.partyGames.jigsawPB}`;
    break;
  }

  case "Parkour" : {
    stat1 = "Jungle Jump";
    stat2 = `Wins - ${account.partyGames.jungleJumpWins}`;
    stat3 = `Personal Best - ${account.partyGames.jungleJumpPB}`;
    stat4 = "The Floor is Lava";
    stat5 = `Wins - ${account.partyGames.theFloorIsLavaWins}`;
    stat6 = `Personal Best - ${account.partyGames.theFloorIsLavaPB}`;
    break;
  }

  case "Lab Escape" : {
    stat2 = `Wins - ${account.partyGames.labEscapeWins}`;
    stat5 = `Personal Best - ${account.partyGames.labEscapePB}`;
    break;
  }

  case "Lawn Moower" : {
    stat1 = `Wins - ${account.partyGames.lawnMoowerWins}`;
    stat4 = `Total Score - ${account.partyGames.lawnMoowerScore}`;
    stat5 = `Personal Best - ${account.partyGames.lawnMoowerPB}`;
    break;
  }

  case "Minecart Racing" : {
    stat2 = `Wins - ${account.partyGames.minecartRacingWins}`;
    stat5 = `Personal Best - ${account.partyGames.minecartRacingPB}`;
    break;
  }

  case "RPG-16" : {
    stat1 = `Wins - ${account.partyGames.rpgWins}`;
    stat4 = `Total Score - ${account.partyGames.rpgKills}`;
    stat5 = `Personal Best - ${account.partyGames.rpgPB}`;
    break;
  }

  case "Spider Maze" : {
    stat2 = `Wins - ${account.partyGames.spiderMazeWins}`;
    stat5 = `Personal Best - ${account.partyGames.spiderMazePB}`;
    break;
  }

  case "Avalanche" : {
    stat2 = `Wins - ${account.partyGames.avalancheWins}`;
    break;
  }

  case "Volcano" : {
    stat2 = `Wins - ${account.partyGames.volcanoWins}`;
    break;
  }

  case "Misc Pigs" : {
    stat1 = "Pig Fishing";
    stat2 = `Wins - ${account.partyGames.pigFishingWins}`;
    stat4 = "Pig Jousting";
    stat5 = `Wins - ${account.partyGames.pigJoustingWins}`;
    break;
  }

  case "Trampolinio" : {
    stat2 = `Wins - ${account.partyGames.trampolinioWins}`;
    break;
  }

  case "Workshop" : {
    stat2 = `Wins - ${account.partyGames.workshopWins}`;
    break;
  }

  case "Shooting Range" : {
    stat2 = `Wins - ${account.partyGames.shootingRangeWins}`;
    break;
  }

  case "Frozen Floor" : {
    stat2 = `Wins - ${account.partyGames.frozenFloorWins}`;
    break;
  }

  case "Cannon Painting" : {
    stat2 = `Wins - ${account.partyGames.cannonPaintingWins}`;
    break;
  }

  case "Fire Leapers" : {
    stat2 = `Wins - ${account.partyGames.fireLeapersWins}`;
    break;
  }

  case "Super Sheep" : {
    stat2 = `Wins - ${account.partyGames.superSheepWins}`;
    break;
  }
  }

  if(stat1 != "") img.writeText(stat1, 320, 350, "center", "#55FF55", "40px");
  if(stat2 != "") img.writeText(stat2, 320, 450, "center", "#55FFFF", "40px");
  if(stat3 != "") img.writeText(stat3, 320, 550, "center", "#FFFF55", "40px");
  if(stat4 != "") img.writeText(stat4, 960, 350, "center", "#55FF55", "40px");
  if(stat5 != "") img.writeText(stat5, 960, 450, "center", "#55FFFF", "40px");
  if(stat6 != "") img.writeText(stat6, 960, 550, "center", "#FFFF55", "40px");

  return img.toDiscord();
}

module.exports = generateImage;