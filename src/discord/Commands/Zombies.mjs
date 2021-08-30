import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

const { MessageEmbed } = require("discord.js");

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
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createDefaultEmbed (acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Zombies stats`)
    .addField("Stats",
      `**Wins** - ${numberify(acc.zombies?.wins_zombies ?? 0)}\n` +
            `**Rounds** - ${numberify(acc.zombies?.total_rounds_survived_zombies ?? 0)}\n` +
            `**Kills** - ${numberify(acc.zombies?.zombie_kills_zombies ?? 0)}\n` +
            `**Knocks** - ${numberify(acc.zombies?.times_knocked_down_zombies ?? 0)}\n` +
            `**Deaths** - ${numberify(acc.zombies?.deaths_zombies ?? 0)}\n`,
      true)
    .addField("Info",
      `**Doors opened** - ${numberify(acc.zombies?.doors_opened_zombies ?? 0)}\n` +
        `**Fastest win** - ${numberify(Math.min(acc.zombies?.fastest_time_30_zombies_badblood_normal ?? 99999, acc.zombies?.fastest_time_30_zombies_deadend_normal ?? 99999, acc.zombies?.fastest_time_30_zombies_alienarcadium_normal ?? 99999))}s\n` +
        `**Best round** - ${numberify(acc.zombies?.best_round_zombies ?? 0)}\n` +
        `**Revives** - ${numberify(acc.zombies?.players_revived_zombies ?? 0)}\n`,
      true)
    .addField("Ratios",
      `**Kills/Rounds** - ${numberify((acc.zombies?.zombie_kills_zombies ?? 0) / (acc.zombies?.total_rounds_survived_zombies ?? 0))}\n` +
        `**Accuracy** - ${numberify((acc.zombies?.bullets_shot_zombies ?? 0) / (acc.zombies?.bullets_hit_zombies ?? 0))}\n` +
        `**Revives/Deaths** - ${numberify((acc.zombies?.players_revived_zombies ?? 0) / (acc.zombies?.deaths_zombies ?? 0))}\n` +
        `**Headshot ratio** - ${numberify((acc.zombies?.headshots_zombies ?? 0) / (acc.zombies?.bullets_hit_zombies ?? 0))}\n`,
      true)
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 * 
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createBadBloodEmbed (acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Bad Blood stats`)
    .addField("Stats",
      `**Wins** - ${numberify(acc.zombies?.wins_zombies_badblood ?? 0)}\n` +
        `**Rounds** - ${numberify(acc.zombies?.total_rounds_survived_zombies_badblood ?? 0)}\n` +
        `**Kills** - ${numberify(acc.zombies?.zombie_kills_zombies_badblood ?? 0)}\n` +
        `**Knocks** - ${numberify(acc.zombies?.times_knocked_down_zombies_badblood ?? 0)}\n` +
        `**Deaths** - ${numberify(acc.zombies?.deaths_zombies_badblood ?? 0)}\n`,
      true)
    .addField("Info",
      `**Doors opened** - ${numberify(acc.zombies?.doors_opened_zombies_badblood ?? 0)}\n` +
        `**Fastest win** - ${numberify(acc.zombies?.fastest_time_30_zombies_badblood_normal ?? 99999)}s\n` +
        `**Best round** - ${numberify(acc.zombies?.best_round_zombies_badblood ?? 0)}\n` +
        `**Revives** - ${numberify(acc.zombies?.players_revived_zombies_badblood ?? 0)}\n`,
      true)
    .addField("Ratios",
      `**Kills/Rounds** - ${numberify((acc.zombies?.zombie_kills_zombies_badblood ?? 0) / (acc.zombies?.total_rounds_survived_zombies_badblood ?? 0))}\n` +
        `**Revives/Deaths** - ${numberify((acc.zombies?.players_revived_zombies_badblood ?? 0) / (acc.zombies?.deaths_zombies_badblood ?? 0))}`,
      true)
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 * 
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createDeadEndEmbed (acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Dead End stats`)
    .addField("Stats",
      `**Wins** - ${numberify(acc.zombies?.wins_zombies_deadend ?? 0)}\n` +
        `**Rounds** - ${numberify(acc.zombies?.total_rounds_survived_zombies_deadend ?? 0)}\n` +
        `**Kills** - ${numberify(acc.zombies?.zombie_kills_zombies_deadend ?? 0)}\n` +
        `**Knocks** - ${numberify(acc.zombies?.times_knocked_down_zombies_deadend ?? 0)}\n` +
        `**Deaths** - ${numberify(acc.zombies?.deaths_zombies_deadend ?? 0)}\n`,
      true)
    .addField("Info",
      `**Doors opened** - ${numberify(acc.zombies?.doors_opened_zombies_deadend ?? 0)}\n` +
        `**Fastest win** - ${numberify(acc.zombies?.fastest_time_30_zombies_deadend_normal ?? 99999)}s\n` +
        `**Best round** - ${numberify(acc.zombies?.best_round_zombies_deadend ?? 0)}\n` +
        `**Revives** - ${numberify(acc.zombies?.players_revived_zombies_deadend ?? 0)}\n`,
      true)
    .addField("Ratios",
      `**Kills/Rounds** - ${numberify((acc.zombies?.zombie_kills_zombies_deadend ?? 0) / (acc.zombies?.total_rounds_survived_zombies_deadend ?? 0))}\n` +
        `**Revives/Deaths** - ${numberify((acc.zombies?.players_revived_zombies_deadend ?? 0) / (acc.zombies?.deaths_zombies_deadend ?? 0))}`,
      true)
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 * 
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createAlienArcadiumEmbed (acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Alien Arcadium stats`)
    .addField("Stats",
      `**Wins** - ${numberify(acc.zombies?.wins_zombies_alienarcadium ?? 0)}\n` +
        `**Rounds** - ${numberify(acc.zombies?.total_rounds_survived_zombies_alienarcadium ?? 0)}\n` +
        `**Kills** - ${numberify(acc.zombies?.zombie_kills_zombies_alienarcadium ?? 0)}\n` +
        `**Knocks** - ${numberify(acc.zombies?.times_knocked_down_zombies_alienarcadium ?? 0)}\n` +
        `**Deaths** - ${numberify(acc.zombies?.deaths_zombies_alienarcadium ?? 0)}\n`,
      true)
    .addField("Info",
      `**Doors opened** - ${numberify(acc.zombies?.doors_opened_zombies_alienarcadium ?? 0)}\n` +
        `**Fastest win** - ${numberify(acc.zombies?.fastest_time_30_zombies_alienarcadium_normal ?? 99999)}s\n` +
        `**Best round** - ${numberify(acc.zombies?.best_round_zombies_alienarcadium ?? 0)}\n` +
        `**Revives** - ${numberify(acc.zombies?.players_revived_zombies_alienarcadium ?? 0)}\n`,
      true)
    .addField("Ratios",
      `**Kills/Rounds** - ${numberify((acc.zombies?.zombie_kills_zombies_alienarcadium ?? 0) / (acc.zombies?.total_rounds_survived_zombies_alienarcadium ?? 0))}\n` +
        `**Revives/Deaths** - ${numberify((acc.zombies?.players_revived_zombies_alienarcadium ?? 0) / (acc.zombies?.deaths_zombies_alienarcadium ?? 0))}`,
      true)
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}


export default new Command("zombies", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const map = args[1] ?? "";

  let acc;
  if(interaction == undefined) {
    acc = await BotRuntime.resolveAccount(plr, rawMsg, args.length != 2);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction, "player");
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }

  let embed;

  switch(map.toLowerCase()) {
  case "bb" : {
    embed = createBadBloodEmbed(acc);
    break;
  }

  case "de" : {
    embed = createDeadEndEmbed(acc);
    break;
  }

  case "aa" : {
    embed = createAlienArcadiumEmbed(acc);
    break;
  }

  default : {
    embed = createDefaultEmbed(acc);
    break;
  }
  }

  return {
    res: "",
    embed
  };
});
