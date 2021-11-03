const Database = require("../Utils/Database");
const ImageGenerator = require("./ImageGenerator");

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

module.exports = async function FakeLb (path, category, time) {
  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground("resources/lb3.png", 0, 0, 1900, 1035, "#00000000");
    
  let y = 100;
  const dy = 48;
  const x = 915;
  const fontSize = 32;

  const timeTitle = path == undefined ? "Monthly Wins" : (time == undefined) ? "Lifetime Wins" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)} Wins`;
  let gameTitle = "";

  switch(category) {
  case "blockingDead" : gameTitle = "Blocking dead"; break;
  case "bountyHunters" : gameTitle = "Bounty hunters"; break;
  case "captureTheWool" : gameTitle = "Capture the wool"; break;
  case "dragonWars" : gameTitle = "Dragon wars"; break;
  case "enderSpleef" : gameTitle = "Ender spleef"; break;
  case "farmhunt" : gameTitle = "Farm hunt"; break;
  case "football" : gameTitle = "Football"; break;
  case "galaxyWars" : gameTitle = "Galaxy wars"; break;
  case "hideAndSeek" : gameTitle = "Hide and seek"; break;
  case "holeInTheWall" : gameTitle = "Hole in the wall"; break;
  case "hypixelSays" : gameTitle = "Hypixel says"; break;
  case "partyGames" : gameTitle = "Party games"; break;
  case "pixelPainters" : gameTitle = "Pixel painters"; break;
  case "throwOut" : gameTitle = "Throw out"; break;
  default : gameTitle = "Mini walls";
  }

  await img.drawNameTag(timeTitle, x, y += dy, "#55FFFF", fontSize);
  await img.drawNameTag(gameTitle, x, y += dy, "#AAAAAA", fontSize);
  y += 10;

  let topTen;
  if(path == undefined) {
    topTen = (await Database.getMWLeaderboard("wins", "monthly")).slice(0, 10);
  } else {
    topTen = (await Database.getLeaderboard(path, category, time)).slice(0, 10);
  }

  for(let i = 0; i < topTen.length; i += 1) {
    if(time == undefined) {
      img.drawLBPos(`${i + 1}`, topTen[i].rank, "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, formatNum(topTen[i]?.[category]?.[path] ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
    } else {
      img.drawLBPos(`${i + 1}`, topTen[i].rank, "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, formatNum(topTen[i]?.lbProp ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
    }
  }

  y += 10;
  await img.drawNameTag("Click to toggle!", x, y += dy, "#FFAA00", fontSize);

  const strTime = path == undefined ? "monthly" : time ?? "lifetime";
  await img.drawTimeType(strTime, x, y += dy, fontSize);

  return img.toDiscord();
};