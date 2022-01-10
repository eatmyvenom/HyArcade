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

  return { game: game.replace(/_/g, " "), num: numberify(max) };
}

export default new Command(["profile", "p", "arcprofile", "arcade-profile"], ["*"], async (args, rawMsg, interaction) => {
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
  await img.addBackground("resources/arcblur2.png", 0, 0, 1280, 800, "#0000008F");

  img.drawMcText("&f&lArcade Games", 640, 50, 56, "center");
  img.drawMcText(ImageGenerator.formatAcc(acc, true), 640, 100, 50, "center");

  const wins = `${numberify(Math.max(acc.arcadeWins, acc.combinedArcadeWins))}`;
  const ap = `${numberify(acc.arcadeAchievments.totalEarned)} / ${numberify(acc.arcadeAchievments.totalAvailiable)}`;
  const quests = `${Object.values(acc.quests).reduce((p, c) => p + c, 0)}`;
  const challenges = `${numberify(Object.values(acc.arcadeChallenges).reduce((p, c) => p + c, 0))}`;

  const ogY = 175;
  const increase = 50;
  const spacer = 40;

  let y = ogY;

  img.drawMcText("&eTotal Wins", 640, y += increase, 42, "center");
  img.drawMcText(`&e${wins}`, 640, y += increase, 50, "center");

  y += spacer;

  img.drawMcText("&bAchievements", 300, y += increase, 42, "center");
  img.drawMcText(`&b${ap}`, 300, y += increase, 50, "center");

  y += spacer;

  img.drawMcText("&6Arcade Quests", 300, y += increase, 42, "center");
  img.drawMcText(`&6${numberify(quests)}`, 300, y += increase, 50, "center");

  y += spacer;

  img.drawMcText("&aArcade Coins", 300, y += increase, 42, "center");
  img.drawMcText(`&a${numberify(acc.arcadeCoins)}`, 300, y += increase, 50, "center");

  y = ogY + increase + increase + spacer;

  const main = getMain(acc);

  img.drawMcText(`&b${main.game} Wins`, 1280 - 300, y += increase, 42, "center");
  img.drawMcText(`&b${main.num}`, 1280 - 300, y += increase, 50, "center");

  y += spacer;

  img.drawMcText("&6Arcade Challenges", 1280 - 300, y += increase, 42, "center");
  img.drawMcText(`&6${(challenges)}`, 1280 - 300, y += increase, 50, "center");

  y += spacer;

  img.drawMcText("&aCoins Earned", 1280 - 300, y += increase, 42, "center");
  img.drawMcText(`&a${numberify(acc.coinsEarned)}`, 1280 - 300, y += increase, 50, "center");

  const attachment = img.toDiscord();

  return { res: "", img: attachment };
}, 7500);
