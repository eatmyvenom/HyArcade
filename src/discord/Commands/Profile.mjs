import Command from "../../classes/Command.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import TimeFormatter from "../Utils/TimeFormatter.js"

function numberify(n) {
    let r = Intl.NumberFormat("en").format(Number(("" + n).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = (r == NaN) ? r = "N/A" : r;
    return r;
}

function getMain(acc) {
    let games = {
        Party_games : acc.wins,
        Hole_in_the_wall : acc.hitwWins,
        Farm_hunt : acc.farmhuntWins,
        Hypixel_says : acc.hypixelSaysWins,
        Mini_walls : acc.miniWallsWins,
        Football : acc.footballWins,
        Ender_spleef : acc.enderSpleefWins,
        Dragon_wars : acc.dragonWarsWins,
        Bounty_hunters : acc.bountyHuntersWins,
        Blocking_dead : acc.blockingDeadWins,
        Hide_and_seek : acc.hideAndSeekWins,
        Zombies : acc.zombiesWins,
        Pixel_painters : acc.pixelPaintersWins,
        Seasonal : acc.simTotal
    };

    let max = 0;
    let game = "";
    for(let g in games) {
        if(games[g] > max) {
            max = games[g];
            game = g;
        }
    }

    return `${game.replace(/_/g, " ")} wins - ${numberify(max)}`;
}

function lastSeen(acc) {
    if(acc.isLoggedIn) {
        return "right now"
    } else {
        return TimeFormatter(acc.lastLogout);
    }
}

export let Profile = new Command("profile", ["*"], async (args, rawMsg, interaction) => {
    let player = args[0];
    let acc;
    if(interaction == undefined) {
        acc = await BotUtils.resolveAccount(player, rawMsg, args.length != 1);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
    }
    let lvl = Math.round(acc.level * 100) / 100;
    let img = new ImageGenerator(640, 400);
    await img.addBackground("resources/arc.png");

    img.writeTitle(acc.name);

    let txt = 
        `Level - ${lvl}\n` +
        `Arcade wins - ${numberify(acc.arcadeWins)}\n` +
        `Coins - ${numberify(acc.arcadeCoins)}\n` +
        `Achievements - ${numberify(acc.achievementPoints)}\n` +
        `Karma - ${numberify(acc.karma)}\n` +
        getMain(acc) + "\n" +
        `Last seen - ${lastSeen(acc)}`;

    img.writeTextCenter(txt, 42);
    let attachment = img.toDiscord();

    return { res : "", img : attachment };
});
