import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import LBDiffAdv from "../../utils/leaderboard/LBDiffAdv.js";
import BotRuntime from "../BotRuntime.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";

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
  return (a?.miniWallsWins ?? 0) - (b?.miniWallsWins ?? 0);
}

/**
 * 
 * @param {Account} n 
 * @param {Account} o 
 * @returns {Account}
 */
function cb (n, o) {
  n.miniWallsWins = toInt(n?.miniWallsWins ?? 0) - toInt(o?.miniWallsWins ?? 0);
  if(n.miniWalls == undefined) {
    n.miniWalls = {};
  }
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

export const FakeLb = new Command("fakelb", ["%trusted%", "303732854787932160"], async () => {
  const img = new ImageGenerator(1900, 1035, "'myFont'");
  await img.addBackground("resources/lb3.png", 0, 0, 1900, 1035, "#00000000");
    
  let y = 104;
  const dy = 44;
  const x = 915;
  const fontSize = 26;
  await img.drawNameTag("Monthly Wins", x, y += dy, "#55FFFF", fontSize);
  await img.drawNameTag("Mini walls", x, y += dy, "#AAAAAA", fontSize);
  y += 10;

  const topTen = await LBDiffAdv(mwComparitor, 10, "monthly", cb, hackerTransformer);
  for(let i = 0; i < topTen.length; i += 1) {
    img.drawLBPos(`${i + 1}`, topTen[i].rank, "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, formatNum(topTen[i].miniWallsWins), x, y += dy, fontSize);
  }

  y += 10;
  await img.drawNameTag("Click to toggle!", x, y += dy, "#FFAA00", fontSize);
  await img.drawTimeType("m", x, y += dy, fontSize);

  const attachment = img.toDiscord();
  return { res: "", img: attachment };
});
