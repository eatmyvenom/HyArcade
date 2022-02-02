import Config from "hyarcade-config";
import Database from "hyarcade-requests/Database.js";
import Account from "hyarcade-requests/types/Account.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";
import ImageGenerator from "../images/ImageGenerator.js";

const cfg = Config.fromJSON();

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  let r = Intl.NumberFormat("en").format(Number(`${n}`.replace(/undefined/g, 0).replace(/null/g, 0)));
  r = Number.isNaN(n) ? (r = "N/A") : r;
  return r;
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function getMain(acc) {
  const games = {
    partyGames: { name: "Party Games", wins: acc?.partyGames?.wins ?? 0 },
    holeInTheWall: { name: "HITW", wins: acc?.holeInTheWall?.wins ?? 0 },
    farmHunt: { name: "Farm Hunt", wins: acc?.farmhunt?.wins ?? 0 },
    hypixelSays: { name: "Hypixel Says", wins: acc?.hypixelSays?.wins ?? 0 },
    miniWalls: { name: "Mini Walls", wins: acc?.miniWalls?.wins ?? 0 },
    football: { name: "Football", wins: acc?.football?.wins ?? 0 },
    enderSpleef: { name: "Ender Spleef", wins: acc?.enderSpleef?.wins ?? 0 },
    dragonWars: { name: "Dragon Wars", wins: acc?.dragonWars?.wins ?? 0 },
    galaxyWars: { name: "Galaxy Wars", wins: acc?.galaxyWars?.wins ?? 0 },
    bountyHunters: { name: "Bounty Hunters", wins: acc?.bountyHunters?.wins ?? 0 },
    blockingDead: { name: "Blocking Dead", wins: acc?.blockingDead?.wins ?? 0 },
    throwOut: { name: "Throw Out", wins: acc?.throwOut?.wins ?? 0 },
    hideAndSeek: { name: "Hide and Seek", wins: acc?.hideAndSeek?.wins ?? 0 },
    zombies: { name: "Zombies", wins: acc?.zombies?.wins_zombies ?? 0 },
    pixelPainters: { name: "Pixel Painters", wins: acc?.pixelPainters?.wins ?? 0 },
    seasonal: { name: "Seasonal", wins: acc?.seasonalWins?.total ?? 0 },
  };

  let max = 0;
  let game = "";
  for (const g in games) {
    if (games[g].wins > max) {
      max = games[g].wins;
      game = games[g].name;
    }
  }

  return { game, num: numberify(max) };
}

export default new Command(
  ["profile", "p", "arcprofile", "arcade-profile"],
  ["*"],
  async (args, rawMsg, interaction) => {
    const player = args[0];
    let acc;
    if (interaction == undefined) {
      acc = await Database.account(player, rawMsg.author.id);
    } else {
      await interaction.deferReply();
      acc = await Database.account(interaction.options.getString("player"), interaction.user.id);
    }

    if (acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }

    const img = new ImageGenerator(1280, 800, "'myFont'", true);
    await img.addBackground(cfg.commandImages.profile.file, 0, 0, 1280, 800, cfg.commandImages.leaderboard.overlay);

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

    img.drawMcText("&eTotal Wins", 640, (y += increase), 42, "center");
    img.drawMcText(`&e${wins}`, 640, (y += increase), 50, "center");

    y += spacer;

    img.drawMcText("&bAchievements", 300, (y += increase), 42, "center");
    img.drawMcText(`&b${ap}`, 300, (y += increase), 50, "center");

    y += spacer;

    img.drawMcText("&6Arcade Quests", 300, (y += increase), 42, "center");
    img.drawMcText(`&6${numberify(quests)}`, 300, (y += increase), 50, "center");

    y += spacer;

    img.drawMcText("&aArcade Coins", 300, (y += increase), 42, "center");
    img.drawMcText(`&a${numberify(acc.arcadeCoins)}`, 300, (y += increase), 50, "center");

    y = ogY + increase + increase + spacer;

    const main = getMain(acc);

    img.drawMcText(`&b${main.game} Wins`, 1280 - 300, (y += increase), 42, "center");
    img.drawMcText(`&b${main.num}`, 1280 - 300, (y += increase), 50, "center");

    y += spacer;

    img.drawMcText("&6Arcade Challenges", 1280 - 300, (y += increase), 42, "center");
    img.drawMcText(`&6${challenges}`, 1280 - 300, (y += increase), 50, "center");

    y += spacer;

    img.drawMcText("&aCoins Earned", 1280 - 300, (y += increase), 42, "center");
    img.drawMcText(`&a${numberify(acc.coinsEarned)}`, 1280 - 300, (y += increase), 50, "center");

    const attachment = img.toDiscord();

    return { res: "", img: attachment };
  },
  7500,
);
