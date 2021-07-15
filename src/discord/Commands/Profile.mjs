import Command from "../../classes/Command.js";
import BotUtils from "../BotUtils.js";
import ImageGenerator from "../images/ImageGenerator.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import TimeFormatter from "../Utils/TimeFormatter.js";

function numberify(n) {
    let r = Intl.NumberFormat("en").format(Number(("" + n).replace(/undefined/g, 0).replace(/null/g, 0)));
    r = r == NaN ? (r = "N/A") : r;
    return r;
}

function getMain(acc) {
    let games = {
        Party_games: acc.wins,
        HITW: acc.hitwWins,
        Farm_hunt: acc.farmhuntWins,
        Hypixel_says: acc.hypixelSaysWins,
        Mini_walls: acc.miniWallsWins,
        Football: acc.footballWins,
        Ender_spleef: acc.enderSpleefWins,
        Dragon_wars: acc.dragonWarsWins,
        Bounty_hunters: acc.bountyHuntersWins,
        Blocking_dead: acc.blockingDeadWins,
        Hide_and_seek: acc.hideAndSeekWins,
        Zombies: acc.zombiesWins,
        Pixel_painters: acc.pixelPaintersWins,
        Seasonal: acc.simTotal,
    };

    let max = 0;
    let game = "";
    for (let g in games) {
        if (games[g] > max) {
            max = games[g];
            game = g;
        }
    }

    return `${game.replace(/_/g, " ")} wins - ${numberify(max)}`;
}

function lastSeen(acc) {
    if (acc.isLoggedIn) {
        return "right now";
    } else {
        return TimeFormatter(acc.lastLogout);
    }
}

export let Profile = new Command("profile", ["*"], async (args, rawMsg, interaction) => {
    let player = args[0];
    let acc;
    if (interaction == undefined) {
        acc = await BotUtils.resolveAccount(player, rawMsg, args.length != 1);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
    }
    let lvl = Math.round(acc.level * 100) / 100;
    let img = new ImageGenerator(640, 400);
    await img.addBackground("resources/arc.png");
    await img.addImage("https://crafatar.com/renders/body/" + acc.uuid + "?overlay", 12, 116, 96, "04");

    if(acc.name?.toLowerCase() == "v3xm") {
        await img.addImage("https://i.eatmyvenom.me/v3xm.png", img.canvas.width / 2 - 110, 12, 0, "00", 220, 60);
    } else {
        img.writeAccTitle(acc.rank, acc.plusColor, acc.name);
    }

    let y = 112;

    img.writeTextRight(`Level - ${lvl}`, y, "#44a3e7", 42);
    img.writeTextRight(`Karma - ${numberify(acc.karma)}`, (y += 42), "#dd66ff", 42);
    img.writeTextRight(`Achievements - ${numberify(acc.achievementPoints)}`, (y += 42), "#00cc66", 42);
    img.writeTextRight(`Arcade Coins - ${numberify(acc.arcadeCoins)}`, (y += 42), "#d69323", 42);
    img.writeTextRight(
        `Arcade wins - ${numberify(Math.max(acc.arcadeWins, acc.combinedArcadeWins))}`,
        (y += 42),
        "#00ddff",
        42
    );
    img.writeTextRight(getMain(acc), (y += 42), "#ee0061", 42);
    img.writeTextRight(`Last seen - ${lastSeen(acc)}`, (y += 42), "#a6ee31", 42);

    let attachment = img.toDiscord();

    return { res: "", img: attachment };
});
