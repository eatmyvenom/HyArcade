import Logger from "hyarcade-logger";
import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import ImageGenerator from "../images/ImageGenerator.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";
import TimeFormatter from "../Utils/Formatting/TimeFormatter.js";

/**
 * @param {number} n
 * @returns {string}
 */
function numberify (n) {
  let r = Intl.NumberFormat("en").format(Number((`${n}`).replace(/undefined/g, 0).replace(/null/g, 0)));
  r = isNaN(n) ? (r = "N/A") : r;
  return r;
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function getMain (acc) {
  const games = {
    Party_games: acc?.partyGames?.wins ?? 0,
    HITW: acc?.holeInTheWall?.wins ?? 0,
    Farm_hunt: acc?.farmhunt?.wins ?? 0,
    Hypixel_says: acc?.hypixelSays?.wins ?? 0,
    Mini_walls: acc?.miniWalls?.wins ?? 0,
    Football: acc?.football?.wins ?? 0,
    Ender_spleef: acc?.enderSpleef?.wins ?? 0,
    Dragon_wars: acc?.dragonWars?.wins ?? 0,
    Galaxy_wars: acc?.galaxyWars?.wins ?? 0,
    Bounty_hunters: acc?.bountyHunters?.wins ?? 0,
    Blocking_dead: acc?.blockingDead?.wins ?? 0,
    Throw_out: acc?.throwOut?.wins ?? 0,
    Hide_and_seek: acc?.hideAndSeek?.wins ?? 0,
    Zombies: acc?.zombies?.wins_zombies ?? 0,
    Pixel_painters: acc?.pixelPainters?.wins ?? 0,
    Seasonal: acc?.seasonalWins?.total ?? 0,
  };

  let max = 0;
  let game = "";
  for (const g in games) {
    if (games[g] > max) {
      max = games[g];
      game = g;
    }
  }

  return `${game.replace(/_/g, " ")} wins - ${numberify(max)}`;
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function lastSeen (acc) {
  if (acc.isLoggedIn) {
    return "right now";
  } 
  return TimeFormatter(acc.lastLogout);
  
}

export const Profile = new Command("profile", ["*"], async (args, rawMsg, interaction) => {
  const player = args[0];
  let acc;
  if (interaction == undefined) {
    acc = await BotRuntime.resolveAccount(player, rawMsg, args.length != 1);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction);
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }
  const lvl = Math.round(acc.level * 100) / 100;
  const img = new ImageGenerator(640, 400, "'myFont'");
  try {
    await img.addBackground("resources/arc.png");
  } catch (e) {
    Logger.err(e);
    Logger.err("Error setting background");
    throw new Error("Error setting background");
  }

  try {
    await img.addImage(`https://crafatar.com/renders/body/${acc.uuid}?overlay`, 12, 116, 32, "08");
  } catch (e) {
    Logger.err(e);
    Logger.err("Error setting skin");
    await img.addImage("resources/wtf.png", 12, 116, 96, "04");
    // throw new Error("Error setting skin");
  }

  if(acc.name?.toLowerCase() == "vn3m") {
    await img.addImage("https://i.eatmyvenom.me/vn3m.png", img.canvas.width / 2 - 110, 12, 0, "00", 220, 60);
  } else {
    img.writeAccTitle(acc.rank, acc.plusColor, acc.name);
  }

  let y = 112;

  img.writeTextRight(`Level - ${lvl}`, y, "#55FFFF", 32);
  img.writeTextRight(`Karma - ${numberify(acc.karma)}`, (y += 42), "#FF55FF", 32);
  img.writeTextRight(`Achievements - ${numberify(acc.achievementPoints)}`, (y += 42), "#55FF55", 32);
  img.writeTextRight(`Arcade Coins - ${numberify(acc.arcadeCoins)}`, (y += 42), "#FFAA00", 32);
  img.writeTextRight(
    `Arcade wins - ${numberify(Math.max(acc.arcadeWins, acc.combinedArcadeWins))}`,
    (y += 42),
    "#5555FF",
    32
  );
  img.writeTextRight(getMain(acc), (y += 42), "#FF5555", 32);
  img.writeTextRight(`Last seen - ${lastSeen(acc)}`, (y += 42), "#FFFF55", 32);

  const attachment = img.toDiscord();

  return { res: "", img: attachment };
});
