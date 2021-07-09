import Command from "../../classes/Command.js";
import LBDiffAdv from "../../utils/leaderboard/LBDiffAdv.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";

function numberify(n) {
    let r = Intl.NumberFormat("en").format(Number(("" + n).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = r == NaN ? (r = "N/A") : r;
    return r;
}

function hackerTransformer(list) {
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
    n.miniWallsWins = int(n.miniWallsWins) - int(o.miniWallsWins);
    if (n.miniWalls != undefined && o.miniWalls != undefined) {
        n.miniWalls.kills = int(n.miniWalls.kills) - int(o.miniWalls.kills);
        n.miniWalls.deaths = int(n.miniWalls.deaths) - int(o.miniWalls.deaths);
        n.miniWalls.witherDamage = int(n.miniWalls.witherDamage) - int(o.miniWalls.witherDamage);
        n.miniWalls.witherKills = int(n.miniWalls.witherKills) - int(o.miniWalls.witherKills);
        n.miniWalls.finalKills = int(n.miniWalls.finalKills) - int(o.miniWalls.finalKills);
    }

    return n;
}

function int(n) {
    return new Number(("" + n).replace(/undefined/g, "0").replace(/null/g, "0"));
}

export let FakeLb = new Command("fakelb", ["*"], async () => {
    let img = new ImageGenerator(640, 400, "'myFont'");
    await img.addBackground("resources/leaderboard1.png", -240, -290, 1280, 1000, "#00000000");
    
    await img.drawNameTag("Monthly Wins", 350, 56, "#55FFFF", 12);
    await img.drawNameTag("Mini walls", 350, 78, "#AAAAAA", 12);
    
    let y = 82;
    let topTen = await LBDiffAdv(mwComparitor, 10, "monthly", cb, hackerTransformer)
    for(let i = 0; i < topTen.length; i++) {
        img.drawLBPos(`${i + 1}`, topTen[i].rank , "", topTen[i].name, topTen[i].guildTag, topTen[i].guildTagColor, numberify(topTen[i].miniWallsWins), 350 , y+=24, 12);
    }

    await img.drawNameTag("Click to toggle!", 350, 352, "#FFAA00", 12);
    await img.drawTimeType("m", 350, 352+24, 12);

    let attachment = img.toDiscord();
    return { res: "", img: attachment };
});
