import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MessageEmbed } = require("discord.js");
import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_WAS_NOT_IN_DATABASE } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

/**
 * @param {Account} acc
 * @returns {string}
 */
function getGames (acc) {
  let games = [{
    name: "Party games",
    wins: acc?.partyGames?.wins ?? 0
  },
  {
    name: "HITW",
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

  let str = "";
  let i = 0;

  for(const g of games) {
    if(g.wins != 0 && g.wins != undefined) {
      str += `${i += 1}) **${g.name}** (${g.wins})\n`;
    }
  }

  return str;

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

  return acc1;
}

/**
 * 
 * @param {string} ign 
 * @returns {CommandResponse}
 */
function nonDatabaseError (ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

export default new Command("top-games", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  let timetype = args[1];

  timetype = timetype == "d" ? "day" : timetype == "w" ? "weekly" : timetype == "m" ? "monthly" : "lifetime";

  let acc;
  if(interaction == undefined) {
    const res = await BotRuntime.resolveAccount(plr, rawMsg, args.length != 2, timetype);
    if(timetype == "lifetime") {
      acc = res;
    } else {
      acc = getTimedAccount(res?.acc, res?.timed);
    }

  } else {
    await interaction.defer();
    const res = await InteractionUtils.resolveAccount(interaction, "player", timetype);
    if(timetype == "lifetime") {
      acc = res;
    } else {
      if(res?.timed == undefined) {
        return nonDatabaseError(res?.acc?.name);
      }
      acc = getTimedAccount(res?.acc, res?.timed);
    }

    if(acc == undefined) return new CommandResponse("", ERROR_UNLINKED);
  }

  const embed = new MessageEmbed()
    .setTitle(`${acc.name}'s ${timetype.slice(0, 1).toUpperCase()}${timetype.slice(1).toLowerCase()} Arcade Wins`)
    .setDescription(getGames(acc))
    .setColor(0x44a3e7);
  
  return new CommandResponse("", embed);
});
