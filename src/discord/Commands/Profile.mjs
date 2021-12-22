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

  return `&l${game.replace(/_/g, " ")}&r &7-&r ${numberify(max)}`;
}

export default new Command(["profile", "p", "arcprofile"], ["*"], async (args, rawMsg, interaction) => {
  const player = args[0];
  let acc;
  if (interaction == undefined) {
    acc = await BotRuntime.resolveAccount(player, rawMsg, args.length != 1);
  } else {
    await interaction.deferReply();
    acc = await InteractionUtils.resolveAccount(interaction);
  }

  if(acc == undefined) {
    return new CommandResponse("", ERROR_UNLINKED);
  }

  const img = new ImageGenerator(1280, 800, "'myFont'", true);
  await img.addBackground("resources/arcblur.png", 0, 0, 1280, 800, "#0000005F");

  img.writeText("Arcade Games Stats", 640, 40, "center", "#FFFFFF", "56px", 0, "'boldmc'");
  img.writeAcc(acc, undefined, 110, "48px");

  const wins = `${numberify(Math.max(acc.arcadeWins, acc.combinedArcadeWins))}`;
  const ap = `${numberify(acc.arcadeAchievments.totalEarned)} / ${numberify(acc.arcadeAchievments.totalAvailiable)}`;
  const quests = `${Object.values(acc.quests).reduce((p, c) => p + c, 0)}`;
  const challenges = `${numberify(Object.values(acc.arcadeChallenges).reduce((p, c) => p + c, 0))}`;

  img.drawMcText(`&l&eTotal Wins &r&7-&r&e ${wins}`, 640, 300, 42, "center");

  img.writeText(`&lAP&r &7-&r ${ap}`, 20, 400, "left", "#55FFFF", "42px");
  img.writeText(`&lQuests&r &7-&r ${numberify(quests)}`, 20, 500, "left", "#FFAA00", "42px");
  img.writeText(`&lTotal Coins&r &7-&r ${numberify(acc.arcadeCoins)}`, 20, 600, "left", "#55FF55", "42px");

  img.writeText(`${getMain(acc)}`, 1260, 400, "right", "#55FFFF", "42px");
  img.writeText(`&lChallenges&r &7-&r ${challenges}`, 1260, 500, "right", "#FFAA00", "42px");
  img.writeText(`&lCoins Earned&r &7-&r ${numberify(acc.coinsEarned)}`, 1260, 600, "right", "#55FF55", "42px");

  const attachment = img.toDiscord();

  return { res: "", img: attachment };
}, 7500);
