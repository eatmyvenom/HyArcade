import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import LBDiffAdv from "../../utils/leaderboard/LBDiffAdv.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum(n) {
    let r = Intl.NumberFormat("en").format(Number(n));
    return r;
}

/**
 * 
 * @param {Account[]} list 
 * @returns {Account[]}
 */
async function hackerTransformer(list) {
    let hackers = await BotUtils.getFromDB("hackerlist");
    list = list.filter((a) => !hackers.includes(a.uuid));
    list = list.filter((a) => a.name != undefined || a.name != "");
    list = list.filter((a) => a.miniWalls != undefined);
    return list;
}

/**
 * 
 * @param {Account} b 
 * @param {Account} a 
 * @returns {Account}
 */
function mwComparitor(b, a) {
    return (a?.miniWallsWins ?? 0) - (b?.miniWallsWins ?? 0);
}

/**
 * 
 * @param {Account} n 
 * @param {Account} o 
 * @returns {Account}
 */
function cb(n, o) {
    n.miniWallsWins = intt(n?.miniWallsWins ?? 0) - intt(o?.miniWallsWins ?? 0);
    if(n.miniWalls == undefined) {
        n.miniWalls = {};
    }
    n.miniWalls.kills = intt(n?.miniWalls?.kills ?? 0) - intt(o?.miniWalls?.kills ?? 0);
    n.miniWalls.deaths = intt(n?.miniWalls?.deaths ?? 0) - intt(o?.miniWalls?.deaths ?? 0);
    n.miniWalls.witherDamage = intt(n?.miniWalls?.witherDamage ?? 0) - intt(o?.miniWalls?.witherDamage ?? 0);
    n.miniWalls.witherKills = intt(n?.miniWalls?.witherKills ?? 0) - intt(o?.miniWalls?.witherKills ?? 0);
    n.miniWalls.finalKills = intt(n?.miniWalls?.finalKills ?? 0) - intt(o?.miniWalls?.finalKills ?? 0);

    return n;
}

/**
 * 
 * @param {number} n 
 * @returns {number}
 */
function intt(n) {
    return new Number(n);
}

export let FakeLb = new Command("fakelb", ["%trusted%", "303732854787932160"], async () => {
    let img = new ImageGenerator(1900, 1035, "'myFont'");
    await img.addBackground("resources/lb3.png", 0 , 0, 1900, 1035, "#00000000");
    
    let y = 104;
    let dy = 44;
    let x = 915;
    let fontSize = 26;
    await img.drawNameTag("Monthly Wins", x, y+=dy, "#55FFFF", fontSize);
    await img.drawNameTag("Mini walls", x, y+=dy, "#AAAAAA", fontSize);
    y+=10;

    let topTen = await LBDiffAdv(mwComparitor, 10, "monthly", cb, hackerTransformer);
    for(let i = 0; i < topTen.length; i++) {
        img.drawLBPos(`${i + 1}`, topTen[i].rank , "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, formatNum(topTen[i].miniWallsWins), x , y+=dy, fontSize);
    }

    y+=10;
    await img.drawNameTag("Click to toggle!", x, y+=dy, "#FFAA00", fontSize);
    await img.drawTimeType("m", x, y+=dy, fontSize);

    let attachment = img.toDiscord();
    return { res: "", img: attachment };
});
