import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Message, Interaction } = require("discord.js");
import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_WAS_NOT_IN_DATABASE } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";
import ButtonGenerator from "../interactions/Buttons/ButtonGenerator.js";
import ImageGenerator from "../images/ImageGenerator.js";

/**
 * @param {Account} acc
 * @returns {object[]}
 */
function getGames (acc) {
  let games = [{
    name: "Party games",
    wins: acc?.partyGames?.wins ?? 0
  },
  {
    name: "Hole in the Wall",
    wins: acc?.holeInTheWall?.wins ?? 0
  },
  {
    name: "Farm hunt",
    wins: acc?.farmhunt?.wins ?? 0
  },
  {
    name: "Hypixel says",
    wins: acc?.hypixelSays?.wins ?? 0
  },
  {
    name: "Mini walls",
    wins: acc?.miniWalls?.wins ?? 0
  },
  {
    name: "Football",
    wins: acc?.football?.wins ?? 0
  },
  {
    name: "Ender spleef",
    wins: acc?.enderSpleef?.wins ?? 0
  },
  {
    name: "Dragon wars",
    wins: acc?.dragonWars?.wins ?? 0
  },
  {
    name: "Bounty hunters",
    wins: acc?.bountyHunters?.wins ?? 0
  },
  {
    name: "Blocking dead",
    wins: acc?.blockingDead?.wins ?? 0
  },
  {
    name: "Throw out",
    wins: acc?.throwOut?.wins ?? 0
  },
  {
    name: "Hide and seek",
    wins: acc?.hideAndSeek?.wins ?? 0
  },
  {
    name: "Zombies",
    wins: acc?.zombies?.wins_zombies ?? 0
  },
  {
    name: "Galaxy wars",
    wins: acc?.galaxyWars?.wins ?? 0
  },
  {
    name: "Pixel painters",
    wins: acc?.pixelPainters?.wins ?? 0
  },
  {
    name: "Seasonal",
    wins: acc?.seasonalWins?.total ?? 0
  },
  ];

  games = games.sort((a, b) => {
    if(b.wins == undefined) {
      return -1;
    }

    if(a.wins == undefined) {
      return 1;
    }

    return b.wins - a.wins;
  });

  return games;

}

/**
 * @param {Account} acc1
 * @param {Account} acc2
 * @returns {Account}
 */
function getTimedAccount (acc1, acc2) {
  acc1.partyGames.wins = (acc1?.partyGames?.wins ?? 0) - (acc2?.partyGames?.wins ?? 0);
  acc1.holeInTheWall.wins = (acc1?.holeInTheWall?.wins ?? 0) - (acc2?.holeInTheWall?.wins ?? 0);
  acc1.farmhunt.wins = (acc1?.farmhunt?.wins ?? 0) - (acc2?.farmhunt?.wins ?? 0);
  acc1.hypixelSays.wins = (acc1?.hypixelSays.wins ?? 0) - (acc2?.hypixelSays.wins ?? 0);
  acc1.miniWalls.wins = (acc1?.miniWalls?.wins ?? 0) - (acc2?.miniWalls?.wins ?? 0);
  acc1.football.wins = (acc1?.football?.wins ?? 0) - (acc2?.football?.wins ?? 0);
  acc1.enderSpleef.wins = (acc1?.enderSpleef?.wins ?? 0) - (acc2?.enderSpleef?.wins ?? 0);
  acc1.dragonWars.wins = (acc1.dragonWars?.wins ?? 0) - (acc2?.dragonWars?.wins ?? 0);
  acc1.bountyHunters.wins = (acc1.bountyHunters?.wins ?? 0) - (acc2?.bountyHunters?.wins ?? 0);
  acc1.blockingDead.wins = (acc1.blockingDead?.wins ?? 0) - (acc2?.blockingDead?.wins ?? 0);
  acc1.throwOut.wins = (acc1.throwOut?.wins ?? 0) - (acc2?.throwOut?.wins ?? 0);
  acc1.hideAndSeek.wins = (acc1?.hideAndSeek?.wins ?? 0) - (acc2?.hideAndSeek?.wins ?? 0);
  acc1.zombies.wins_zombies = (acc1.zombies?.wins_zombies ?? 0) - (acc2?.zombies?.wins_zombies ?? 0);
  acc1.galaxyWars.wins = (acc1?.galaxyWars?.wins ?? 0) - (acc2?.galaxyWars?.wins ?? 0);
  acc1.pixelPainters.wins = (acc1?.pixelPainters?.wins ?? 0) - (acc2?.pixelPainters?.wins ?? 0);
  acc1.seasonalWins.total = (acc1?.seasonalWins?.total ?? 0) - (acc2?.seasonalWins?.total ?? 0);
  acc1.combinedArcadeWins = (acc1?.combinedArcadeWins ?? 0) - (acc2?.combinedArcadeWins ?? 0);

  return acc1;
}

/**
 * @param {number} n
 * @returns {string}
 */
function numberify (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

/**
 * 
 * @param {string} ign 
 * @returns {CommandResponse}
 */
function nonDatabaseError (ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

/**
 * 
 * @param {Account} acc
 * @returns {object}
 */
async function generateImage (acc) {
  const games = getGames(acc);

  const img = new ImageGenerator(3000, 1600, "'myFont'", true);
  await img.addBackground("resources/arcblur.png", 0, 0, 3000, 2040, "#0000007F");

  img.drawMcText(ImageGenerator.formatAcc(acc), img.canvas.width / 2, 80, 128, "center");

  img.drawMcText("&f&lTotal", img.canvas.width / 2, 250, 92, "center");
  img.drawMcText(`&b${numberify(acc.combinedArcadeWins)}`, img.canvas.width / 2, 350, 108, "center");

  let y = 500;
  for(let i = 1; i <= games.length; i += 1) {

    let x;
    switch((i - 1) % 4) {
    case 0: x = 400; break;
    case 1: x = 1133.33; break;
    case 2: x = 1866.66; break;
    case 3: x = 2600; break;
      
    }

    img.drawMcText(`&f&l${games[i - 1].name}`, x, y, 80, "center");
    img.drawMcText(`&b${numberify(games[i - 1].wins)}`, x, y + 100, 108, "center");

    if(i % 4 == 0) {
      y += 300;
    }
  }

  return img.toDiscord();
}

/**
 * 
 * @param {string[]} args 
 * @param {Message} rawMsg 
 * @param {Interaction} interaction 
 * @returns {CommandResponse}
 */
async function topGamesHandler (args, rawMsg, interaction) {
  const plr = args[0];
  let timetype = args[1];

  timetype = timetype == "d" ? "day" : timetype == "w" ? "weekly" : timetype == "m" ? "monthly" : "lifetime";

  let acc;
  let res;
  if(interaction == undefined) {
    res = await BotRuntime.resolveAccount(plr, rawMsg, true, timetype);
  } else {
    if(interaction.isButton()) {
      await interaction.deferUpdate();
      res = await BotRuntime.resolveAccount(plr, undefined, false, timetype);
    } else {
      await interaction.deferReply();
      res = await InteractionUtils.resolveAccount(interaction, "player", timetype);
    }
  }

  if(timetype == "lifetime") {
    acc = res;
  } else {
    if(res?.timed == undefined) {
      return nonDatabaseError(res?.acc?.name);
    }
    acc = getTimedAccount(res?.acc, res?.timed);
  }

  if(acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_IGN_UNDEFINED);

  const img = await generateImage(acc, timetype);

  const buttons = await ButtonGenerator.getTopGames(timetype, acc.uuid);

  return new CommandResponse("", undefined, img, buttons);
}

export default new Command(["top-games", "topgames", "tg", "top"], ["*"], topGamesHandler, 4000);
