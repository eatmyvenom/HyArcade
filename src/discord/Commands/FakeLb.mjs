import Command from "../../classes/Command.js";
import ImageGenerator from "../images/ImageGenerator.js";
import CommandResponse from "../Utils/CommandResponse.js";
import Database from "../Utils/Database.js";

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

export const FakeLb = new Command("fakelb", ["%trusted%", "303732854787932160"], async (args) => {
  const img = new ImageGenerator(1900, 1035, "'myFont'");
  await img.addBackground("resources/lb3.png", 0, 0, 1900, 1035, "#00000000");
    
  let y = 104;
  const dy = 44;
  const x = 915;
  const fontSize = 26;

  const path = args[0];
  const category = args[1];
  const time = args[2];

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
    img.drawLBPos(`${i + 1}`, topTen[i].rank, "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, formatNum(topTen[i]?.[category]?.[path] ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
  }

  y += 10;
  await img.drawNameTag("Click to toggle!", x, y += dy, "#FFAA00", fontSize);

  const strTime = path == undefined ? "monthly" : time ?? "lifetime";
  await img.drawTimeType(strTime, x, y += dy, fontSize);

  const attachment = img.toDiscord();
  return new CommandResponse("", undefined, attachment);
});
