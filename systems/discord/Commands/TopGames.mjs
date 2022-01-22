import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Message, Interaction } = require("discord.js");
import Account from "hyarcade-requests/types/Account.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { ERROR_WAS_NOT_IN_DATABASE } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";
import ButtonGenerator from "../interactions/Buttons/ButtonGenerator.js";
import ImageGenerator from "../images/ImageGenerator.js";
import Config from "hyarcade-config";
import Database from "hyarcade-requests/Database.js";

const cfg = Config.fromJSON();

/**
 * @param {Account} acc
 * @returns {object[]}
 */
function getGames (acc) {
  let games = [{
    name: "Party Games",
    pos: "partyGames",
    wins: acc?.partyGames?.wins ?? 0
  },
  {
    name: "Hole in the Wall",
    pos: "holeInTheWall",
    wins: acc?.holeInTheWall?.wins ?? 0
  },
  {
    name: "Farm Hunt",
    pos: "farmhunt",
    wins: acc?.farmhunt?.wins ?? 0
  },
  {
    name: "Hypixel Says",
    pos: "hypixelSays",
    wins: acc?.hypixelSays?.wins ?? 0
  },
  {
    name: "Mini Walls",
    pos: "miniWalls",
    wins: acc?.miniWalls?.wins ?? 0
  },
  {
    name: "Football",
    pos: "football",
    wins: acc?.football?.wins ?? 0
  },
  {
    name: "Ender Spleef",
    pos: "enderSpleef",
    wins: acc?.enderSpleef?.wins ?? 0
  },
  {
    name: "Dragon Wars",
    pos: "dragonWars",
    wins: acc?.dragonWars?.wins ?? 0
  },
  {
    name: "Bounty Hunters",
    pos: "bountyHunters",

    wins: acc?.bountyHunters?.wins ?? 0
  },
  {
    name: "Blocking Dead",
    pos: "blockingDead",
    wins: acc?.blockingDead?.wins ?? 0
  },
  {
    name: "Throw Out",
    pos: "throwOut",
    wins: acc?.throwOut?.wins ?? 0
  },
  {
    name: "Hide and Seek",
    pos: "hideAndSeek",

    wins: acc?.hideAndSeek?.wins ?? 0
  },
  {
    name: "Zombies",
    pos: "zombies",
    wins: acc?.zombies?.wins_zombies ?? 0
  },
  {
    name: "Galaxy Wars",
    pos: "galaxyWars",
    wins: acc?.galaxyWars?.wins ?? 0
  },
  {
    name: "Pixel Painters",
    pos: "pixelPainters",
    wins: acc?.pixelPainters?.wins ?? 0
  },
  {
    name: "Seasonal",
    pos: "simTotal",
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
 * @param {string} time
 * @returns {object}
 */
async function generateImage (acc, time) {
  const games = getGames(acc);

  const img = new ImageGenerator(3000, 1800, "'myFont'", true);
  await img.addBackground(cfg.commandImages.topGames.file, 0, 0, 3000, 2040, cfg.commandImages.topGames.overlay);

  img.drawMcText("&l&fTop Arcade Games", img.canvas.width / 2, 80, 128, "center");
  img.drawMcText(`${ImageGenerator.formatAcc(acc)}`, img.canvas.width / 2, 220, 128, "center");

  img.drawMcText("&f&lTotal Wins", img.canvas.width / 2, 400, 96, "center");
  img.drawMcText(`&e${numberify(acc.combinedArcadeWins)}`, img.canvas.width / 2, 504, 112, "center");

  let y = 700;
  for(let i = 1; i <= games.length; i += 1) {

    let x;
    switch((i - 1) % 4) {
    case 0: x = 400; break;
    case 1: x = 1133.33; break;
    case 2: x = 1866.66; break;
    case 3: x = 2600; break;
    }

    let pos = "";

    if(time == "lifetime") {
      if((acc.positions?.[games[i - 1]?.pos] ?? 101) < 101) {
        pos = ` &7(#${acc?.positions?.[games[i - 1]?.pos]})`;
      }
    }
    
    img.drawMcText(`&f&l${games[i - 1].name}`, x, y, 76, "center");
    img.drawMcText(`&e${numberify(games[i - 1].wins)}${pos}`, x, y + 100, 104, "center");

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
    res = await Database.timedAccount(plr, rawMsg.author.id, timetype);
  } else {
    if(interaction.isButton()) {
      await interaction.deferUpdate();
      res = await Database.timedAccount(plr, "", timetype);
    } else if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      res = await Database.timedAccount(plr, "", timetype);
    } else {
      await interaction.deferReply();
      res = await Database.timedAccount(interaction.options.getString("player"), interaction.user.id, timetype);
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

  if(acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_UNLINKED);

  const img = await generateImage(acc, timetype);

  const buttons = await ButtonGenerator.getTopGames(timetype, acc.uuid);

  return new CommandResponse("", undefined, img, buttons);
}

export default new Command(["top-games", "topgames", "tg", "top"], ["*"], topGamesHandler, 4000);
