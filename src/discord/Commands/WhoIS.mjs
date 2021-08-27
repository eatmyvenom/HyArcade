import { MessageEmbed } from "discord.js";
import Account from "hyarcade-requests/types/Account";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { COLOR_PURPLE } from "../Utils/Embeds/Colors.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

/**
 * @param {Account} acc
 * @returns {string}
 */
function getMain (acc) {
  const games = {
    Party_games: acc.partyGames.wins,
    HITW: acc.holeInTheWall.wins,
    Farm_hunt: acc.farmhunt.wins,
    Hypixel_says: acc.hypixelSays.wins,
    Mini_walls: acc.miniWalls.wins,
    Football: acc.football.wins,
    Ender_spleef: acc.enderSpleef.wins,
    Dragon_wars: acc.dragonWars.wins,
    Galaxy_wars: acc.galaxyWars.wins,
    Bounty_hunters: acc.bountyHunters.wins,
    Blocking_dead: acc.blockingDead.wins,
    Throw_out: acc.throwOut.wins,
    Hide_and_seek: acc.hideAndSeek.wins,
    Zombies: acc.zombies.wins_zombies,
    Pixel_painters: acc.pixelPainters.wins,
    Seasonal: acc.seasonalWins.total,
  };

  let max = 0;
  let game = "";
  for (const g in games) {
    if (games[g] > max) {
      max = games[g];
      game = g;
    }
  }

  return `${game.replace(/_/g, " ")}`;
}

/**
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function generateWhoisEmbed (acc) {

  const rank = acc.rank != "NONE" && acc.rank != "NORMAL" && acc.rank != "" && acc.rank != undefined ? `[${acc.rank.replace(/_PLUS/g, "+")}] ` : "";

  const embed = new MessageEmbed()
    .setTitle(`Who is ${rank}${acc.name}`)
    .setColor(COLOR_PURPLE);

  let discord = "";

  if(acc.discord != undefined) {
    discord = `<@${acc.discord}>\n**ID** - ${acc.discord}`;
  } else {
    discord = "Unknown!";
  }

  embed.addField("--- Discord ---", discord, true);
  embed.addField("---- Names ----", acc.nameHist.map((n, i) => `${i + 1} - **${n}**`).join("\n"), true);
  embed.addField("---- Info -----", `**Guild** - ${acc.guild ?? "Unknown"}\n**Main** - ${getMain(acc)}\n**`, true);

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
