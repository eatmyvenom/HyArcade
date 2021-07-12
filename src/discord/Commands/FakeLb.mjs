import Command from "../../classes/Command.js";
import LBDiffAdv from "../../utils/leaderboard/LBDiffAdv.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";

function numberify(n) {
    let r = Intl.NumberFormat("en").format(Number(("" + n).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = r == NaN ? (r = "N/A") : r;
    return r;
}

async function hackerTransformer(list) {
    let hackers = await BotUtils.getFromDB("hackerlist")
    list = list.filter((a) => !hackers.includes(a.uuid));
    list = list.filter((a) => a.name != undefined || a.name != "");
    list = list.filter((a) => a.miniWalls != undefined);
    return list;
}

function mwComparitor(b, a) {
    if (a.miniWallsWins == undefined || a.miniWallsWins == NaN) {
        return 1;
    }

    if (b.miniWallsWins == undefined || b.miniWallsWins == NaN) {
        return -1;
    }
    return a.miniWallsWins - b.miniWallsWins;
}

function cb(n, o) {
    n.miniWallsWins = intt(n.miniWallsWins) - intt(o.miniWallsWins);
    if (n.miniWalls != undefined && o.miniWalls != undefined) {
        n.miniWalls.kills = intt(n.miniWalls.kills) - intt(o.miniWalls.kills);
        n.miniWalls.deaths = intt(n.miniWalls.deaths) - intt(o.miniWalls.deaths);
        n.miniWalls.witherDamage = intt(n.miniWalls.witherDamage) - intt(o.miniWalls.witherDamage);
        n.miniWalls.witherKills = intt(n.miniWalls.witherKills) - intt(o.miniWalls.witherKills);
        n.miniWalls.finalKills = intt(n.miniWalls.finalKills) - intt(o.miniWalls.finalKills);
    }

    return n;
}

function intt(n) {
    return new Number(("" + n).replace(/undefined/g, "0").replace(/null/g, "0"));
}

export let FakeLb = new Command("fakelb", ["%trusted%"], async () => {
    let img = new ImageGenerator(1900, 1035, "'myFont'");
    await img.addBackground("resources/lb3.png", 0 , 0, 1900, 1035, "#00000000");
    
    let y = 104;
    let dy = 44;
    let x = 915;
    let fontSize = 26;
    await img.drawNameTag("Monthly Wins", x, y+=dy, "#55FFFF", fontSize);
    await img.drawNameTag("Mini walls", x, y+=dy, "#AAAAAA", fontSize);
    y+=10
    
    let topTen = await LBDiffAdv(mwComparitor, 10, "monthly", cb, hackerTransformer)
    for(let i = 0; i < topTen.length; i++) {
        img.drawLBPos(`${i + 1}`, topTen[i].rank , "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, numberify(topTen[i].miniWallsWins), x , y+=dy, fontSize);
    }

    y+=10;
    await img.drawNameTag("Click to toggle!", x, y+=dy, "#FFAA00", fontSize);
    await img.drawTimeType("m", x, y+=dy, fontSize);

    let attachment = img.toDiscord();
    return { res: "", img: attachment };
});
