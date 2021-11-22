const ImageGenerator = require("../ImageGenerator");

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

module.exports = async function Arc3 (path, category, time, topTen) {

  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground("resources/lb3.png", 0, 0, 1900, 1035, "#00000000");

  let y = 100;
  const dy = 48;
  const x = 915;
  const fontSize = 32;

  let timeTitle = path == undefined ? "Monthly" : (time == undefined) ? "Lifetime" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)}`;
  let gameTitle = "";

  timeTitle += `${(path ?? "wins").slice(0, 1).toUpperCase()}${(path ?? "wins").slice(1)}`.replace(/([A-Z])/g, " $1");
  if(timeTitle.includes("_")) {
    timeTitle = timeTitle.slice(0, timeTitle.indexOf("_"));
  }

  switch(category) {
  case "blockingDead" : gameTitle = "Blocking Dead"; break;
  case "bountyHunters" : gameTitle = "Bounty Hunters"; break;
  case "captureTheWool" : gameTitle = "Capture the Wool"; break;
  case "dragonWars" : gameTitle = "Dragon Wars"; break;
  case "enderSpleef" : gameTitle = "Ender Spleef"; break;
  case "farmhunt" : gameTitle = "Farm Hunt"; break;
  case "football" : gameTitle = "Football"; break;
  case "galaxyWars" : gameTitle = "Galaxy Wars"; break;
  case "hideAndSeek" : gameTitle = "Hide and Seek"; break;
  case "holeInTheWall" : gameTitle = "Hole in the Wall"; break;
  case "hypixelSays" : gameTitle = "Hypixel Says"; break;
  case "partyGames" : gameTitle = "Party Games"; break;
  case "pixelPainters" : gameTitle = "Pixel Painters"; break;
  case "throwOut" : gameTitle = "Throw Out"; break;
  case "zombies" : gameTitle = "Zombies" ; break;
  default : gameTitle = "Mini Walls";
  }

  await img.drawNameTag(timeTitle, x, y += dy, "b", fontSize, "'boldmc'");
  await img.drawNameTag(gameTitle, x, y += dy, "7", fontSize);
  y += 10;

  for(let i = 0; i < topTen.length; i += 1) {
    if(time == undefined) {
      img.drawLBPlayer(topTen[i], `${i + 1}`, formatNum(topTen[i]?.[category]?.[path] ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
    } else {
      img.drawLBPlayer(topTen[i], `${i + 1}`, formatNum(topTen[i]?.lbProp ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
    }
  }

  y += 10;
  await img.drawNameTag("Click to toggle!", x, y += dy, "6", fontSize, "'boldmc'");

  const strTime = path == undefined ? "monthly" : time ?? "lifetime";
  await img.drawTimeType(strTime, x, y += dy, fontSize);

  return img.toDiscord();
};