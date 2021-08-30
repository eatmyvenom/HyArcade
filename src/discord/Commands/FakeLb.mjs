import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import LBDiffAdv from "../../utils/leaderboard/LBDiffAdv.js";
import BotRuntime from "../BotRuntime.js";
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

/**
 * 
 * @param {Account[]} list 
 * @returns {Account[]}
 */
async function hackerTransformer (list) {
  const hackers = await BotRuntime.getHackerlist();
  let newlist = list.filter((a) => !hackers.includes(a.uuid));
  newlist = newlist.filter((a) => a.name != undefined || a.name != "");
  newlist = newlist.filter((a) => a.miniWalls != undefined);
  return newlist;
}

/**
 * 
 * @param {Account} b 
 * @param {Account} a 
 * @returns {Account}
 */
function mwComparitor (b, a) {
  return (a?.miniWalls.wins ?? 0) - (b?.miniWalls.wins ?? 0);
}

/**
 * 
 * @param {Account} n 
 * @param {Account} o 
 * @returns {Account}
 */
function cb (n, o) {
  if(n.miniWalls == undefined) {
    n.miniWalls = {};
  }
  n.miniWalls.wins = toInt(n?.miniWalls?.wins ?? 0) - toInt(o?.miniWalls?.wins ?? 0);
  n.miniWalls.kills = toInt(n?.miniWalls?.kills ?? 0) - toInt(o?.miniWalls?.kills ?? 0);
  n.miniWalls.deaths = toInt(n?.miniWalls?.deaths ?? 0) - toInt(o?.miniWalls?.deaths ?? 0);
  n.miniWalls.witherDamage = toInt(n?.miniWalls?.witherDamage ?? 0) - toInt(o?.miniWalls?.witherDamage ?? 0);
  n.miniWalls.witherKills = toInt(n?.miniWalls?.witherKills ?? 0) - toInt(o?.miniWalls?.witherKills ?? 0);
  n.miniWalls.finalKills = toInt(n?.miniWalls?.finalKills ?? 0) - toInt(o?.miniWalls?.finalKills ?? 0);

  return n;
}

/**
 * 
 * @param {number} n 
 * @returns {number}
 */
function toInt (n) {
  return new Number(n);
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
    topTen = await LBDiffAdv(mwComparitor, 10, "monthly", cb, hackerTransformer);
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
