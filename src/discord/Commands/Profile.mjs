import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import ImageGenerator from "../images/ImageGenerator.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

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

  return `${game.replace(/_/g, " ")} - ${numberify(max)}`;
}

export const Profile = new Command("profile", ["*"], async (args, rawMsg, interaction) => {
  const player = args[0];
  let acc;
  if (interaction == undefined) {
    acc = await BotRuntime.resolveAccount(player, rawMsg, args.length != 1);
  } else {
    await interaction.defer();
    acc = await InteractionUtils.resolveAccount(interaction);
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }
  const img = new ImageGenerator(1280, 800, "'myFont'");
  await img.addBackground("resources/arcblur.png", 0, 0, 1280, 800, "#0000005F");

  img.writeText("Arcade Games Stats", 640, 40, "center", "#FFFFFF", "48px");
  img.writeAcc(acc, undefined, 100, "42px");

  const wins = `${numberify(Math.max(acc.arcadeWins, acc.combinedArcadeWins))}`;
  const ap = `${numberify(acc.arcadeAchievments.totalEarned)} / ${numberify(acc.arcadeAchievments.totalAvailiable)}`;
  const quests = `${Object.values(acc.quests).reduce((p, c) => p + c, 0)}`;
  const challenges = `${numberify(Object.values(acc.arcadeChallenges).reduce((p, c) => p + c, 0))}`;

  img.writeText(`Total Wins - ${wins}`, 640, 300, "center", "#FFFF55", "34px");

  img.writeText(`AP - ${ap}`, 320, 400, "center", "#55FFFF", "34px");
  img.writeText(`Quests - ${numberify(quests)}`, 320, 500, "center", "#FF55FF", "34px");
  img.writeText(`Total Coins - ${numberify(acc.arcadeCoins)}`, 320, 600, "center", "#55FF55", "34px");

  img.writeText(`${getMain(acc)}`, 960, 400, "center", "#55FFFF", "34px");
  img.writeText(`Challenges - ${challenges}`, 960, 500, "center", "#FF55FF", "34px");
  img.writeText(`Coins Earned - ${numberify(acc.coinsEarned)}`, 960, 600, "center", "#55FF55", "34px");

  const attachment = img.toDiscord();

  return { res: "", img: attachment };
});
