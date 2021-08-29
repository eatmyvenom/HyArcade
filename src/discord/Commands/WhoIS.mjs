import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { COLOR_PURPLE } from "../Utils/Embeds/Colors.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

const { MessageEmbed, Util } = require("discord.js");
const { escapeUnderline } = Util;

/**
 * 
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

  return `${game.replace(/_/g, " ")}: **${numberify(max)} wins**`;
}

/**
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function generateWhoisEmbed (acc) {

  const rank = acc.rank != "NONE" && acc.rank != "NORMAL" && acc.rank != "" && acc.rank != undefined ? `[${acc.rank.replace(/_PLUS/g, "+")}] ` : "";

  const embed = new MessageEmbed()
    .setTitle(`Who is ${rank}${acc.name}`)
    .setThumbnail(`https://crafatar.com/renders/body/${acc.uuid}?overlay&time=${Date.now()}`)
    .setColor(COLOR_PURPLE);

  let discord = "";

  if(acc.discord != undefined) {
    discord = `**Ping** - <@${acc.discord}>\n**ID** - ${acc.discord}\n**Hypixel tag** - ${acc.hypixelDiscord}`;
  } else {
    discord = "Unknown!";
  }

  embed.addField("--------- Names ---------", acc.nameHist.map((n, i) => `${i + 1} - **${escapeUnderline(n)}**`).join("\n"), true);
  embed.addField("-------- Discord --------", discord, true);
  embed.addField("--------- Info ----------", `**Guild** - ${acc.guild ?? "Unknown"}\n**Main** - ${getMain(acc)}`, false);

  return embed;
}

export const WhoIS = new Command("whois", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  let acc;
  if (interaction == undefined) {
    acc = await BotRuntime.resolveAccount(plr, rawMsg, args.length != 2);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction);
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }
  const embed = generateWhoisEmbed(acc);
  return new CommandResponse("", embed);
});
