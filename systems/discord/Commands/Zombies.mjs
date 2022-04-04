import Database from "@hyarcade/requests/Database.js";
import { Account, Command, CommandResponse } from "@hyarcade/structures";
import { createRequire } from "node:module";
import ZombiesButtons from "../interactions/Components/Buttons/Generators/ZombiesButtons.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

const require = createRequire(import.meta.url);

const { MessageEmbed } = require("discord.js");

/**
 * @param {number} n
 * @returns {string}
 */
function toPercent(n) {
  return `${(n * 100).toFixed(2)} %`;
}

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

/**
 * @param {number} secs
 * @returns {string}
 */
function toHHMMSS(secs) {
  if (secs == 99999) {
    return "N/A";
  }

  const secNum = Number.parseInt(secs, 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;

  return [hours, minutes, seconds]
    .map(v => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

/**
 *
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createDefaultEmbed(acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Zombies stats`)
    .addField(
      "Stats",
      `・**Wins** - \`${numberify(acc.zombies?.wins_zombies ?? 0)}\`\n` +
        `・**Rounds** - \`${numberify(acc.zombies?.total_rounds_survived_zombies ?? 0)}\`\n` +
        `・**Kills** - \`${numberify(acc.zombies?.zombie_kills_zombies ?? 0)}\`\n` +
        `・**Knocks** - \`${numberify(acc.zombies?.times_knocked_down_zombies ?? 0)}\`\n` +
        `・**Deaths** - \`${numberify(acc.zombies?.deaths_zombies ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Info",
      `・**Fastest win** - \`${toHHMMSS(
        Math.min(
          acc.zombies?.fastest_time_30_zombies_badblood_normal ?? 99999,
          acc.zombies?.fastest_time_30_zombies_deadend_normal ?? 99999,
          acc.zombies?.fastest_time_30_zombies_alienarcadium_normal ?? 99999,
        ),
      )}\`\n` +
        `・**Doors opened** - \`${numberify(acc.zombies?.doors_opened_zombies ?? 0)}\`\n` +
        `・**Revives** - \`${numberify(acc.zombies?.players_revived_zombies ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Ratios",
      `・**Kills/Rounds** - \`${numberify(
        (acc.zombies?.zombie_kills_zombies ?? 0) / (acc.zombies?.total_rounds_survived_zombies ?? 0),
      )}\`\n` +
        `・**Revives/Deaths** - \`${numberify((acc.zombies?.players_revived_zombies ?? 0) / (acc.zombies?.deaths_zombies ?? 0))}\`\n` +
        `・**Accuracy** - \`${toPercent((acc.zombies?.bullets_hit_zombies ?? 0) / (acc.zombies?.bullets_shot_zombies ?? 0))}\`\n` +
        `・**Headshots** - \`${toPercent((acc.zombies?.headshots_zombies ?? 0) / (acc.zombies?.bullets_hit_zombies ?? 0))}\``,
      false,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 *
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createBadBloodEmbed(acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Bad Blood stats`)
    .addField(
      "Stats",
      `・**Wins** - \`${numberify(acc.zombies?.wins_zombies_badblood ?? 0)}\`\n` +
        `・**Rounds** - \`${numberify(acc.zombies?.total_rounds_survived_zombies_badblood ?? 0)}\`\n` +
        `・**Kills** - \`${numberify(acc.zombies?.zombie_kills_zombies_badblood ?? 0)}\`\n` +
        `・**Knocks** - \`${numberify(acc.zombies?.times_knocked_down_zombies_badblood ?? 0)}\`\n` +
        `・**Deaths** - \`${numberify(acc.zombies?.deaths_zombies_badblood ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Info",
      `・**Doors opened** - \`${numberify(acc.zombies?.doors_opened_zombies_badblood ?? 0)}\`\n` +
        `・**Fastest win** - \`${toHHMMSS(acc.zombies?.fastest_time_30_zombies_badblood_normal ?? 99999)}\`\n` +
        `・**Best round** - \`${numberify(acc.zombies?.best_round_zombies_badblood ?? 0)}\`\n` +
        `・**Revives** - \`${numberify(acc.zombies?.players_revived_zombies_badblood ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Ratios",
      `・**Kills/Rounds** - \`${numberify(
        (acc.zombies?.zombie_kills_zombies_badblood ?? 0) / (acc.zombies?.total_rounds_survived_zombies_badblood ?? 0),
      )}\`\n` +
        `・**Revives/Deaths** - \`${numberify(
          (acc.zombies?.players_revived_zombies_badblood ?? 0) / (acc.zombies?.deaths_zombies_badblood ?? 0),
        )}\``,
      false,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 *
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createDeadEndEmbed(acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Dead End stats`)
    .addField(
      "Stats",
      `・**Wins** - \`${numberify(acc.zombies?.wins_zombies_deadend ?? 0)}\`\n` +
        `・**Rounds** - \`${numberify(acc.zombies?.total_rounds_survived_zombies_deadend ?? 0)}\`\n` +
        `・**Kills** - \`${numberify(acc.zombies?.zombie_kills_zombies_deadend ?? 0)}\`\n` +
        `・**Knocks** - \`${numberify(acc.zombies?.times_knocked_down_zombies_deadend ?? 0)}\`\n` +
        `・**Deaths** - \`${numberify(acc.zombies?.deaths_zombies_deadend ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Info",
      `・**Doors opened** - \`${numberify(acc.zombies?.doors_opened_zombies_deadend ?? 0)}\`\n` +
        `・**Fastest win** - \`${toHHMMSS(acc.zombies?.fastest_time_30_zombies_deadend_normal ?? 99999)}\`\n` +
        `・**Best round** - \`${numberify(acc.zombies?.best_round_zombies_deadend ?? 0)}\`\n` +
        `・**Revives** - \`${numberify(acc.zombies?.players_revived_zombies_deadend ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Ratios",
      `・**Kills/Rounds** - \`${numberify(
        (acc.zombies?.zombie_kills_zombies_deadend ?? 0) / (acc.zombies?.total_rounds_survived_zombies_deadend ?? 0),
      )}\`\n` +
        `・**Revives/Deaths** - \`${numberify(
          (acc.zombies?.players_revived_zombies_deadend ?? 0) / (acc.zombies?.deaths_zombies_deadend ?? 0),
        )}\``,
      false,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

/**
 *
 * @param {Account} acc
 * @returns {MessageEmbed}
 */
function createAlienArcadiumEmbed(acc) {
  return new MessageEmbed()
    .setTitle(`${acc.name} Alien Arcadium stats`)
    .addField(
      "Stats",
      `・**Wins** - \`${numberify(acc.zombies?.wins_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Rounds** - \`${numberify(acc.zombies?.total_rounds_survived_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Kills** - \`${numberify(acc.zombies?.zombie_kills_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Knocks** - \`${numberify(acc.zombies?.times_knocked_down_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Deaths** - \`${numberify(acc.zombies?.deaths_zombies_alienarcadium ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Info",
      `・**Doors opened** - \`${numberify(acc.zombies?.doors_opened_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Fastest win** - \`${toHHMMSS(acc.zombies?.fastest_time_30_zombies_alienarcadium_normal ?? 99999)}\`\n` +
        `・**Best round** - \`${numberify(acc.zombies?.best_round_zombies_alienarcadium ?? 0)}\`\n` +
        `・**Revives** - \`${numberify(acc.zombies?.players_revived_zombies_alienarcadium ?? 0)}\`\n`,
      true,
    )
    .addField(
      "Ratios",
      `・**Kills/Rounds** - \`${numberify(
        (acc.zombies?.zombie_kills_zombies_alienarcadium ?? 0) / (acc.zombies?.total_rounds_survived_zombies_alienarcadium ?? 0),
      )}\`\n` +
        `・**Revives/Deaths** - \`${numberify(
          (acc.zombies?.players_revived_zombies_alienarcadium ?? 0) / (acc.zombies?.deaths_zombies_alienarcadium ?? 0),
        )}\``,
      false,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay`)
    .setColor(0x44a3e7);
}

export default new Command("zombies", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const map = args[1] ?? "";

  let acc;
  if (interaction == undefined) {
    acc = await Database.account(plr, rawMsg.author.id);
  } else {
    if (interaction.isButton()) {
      await interaction.deferUpdate();
      acc = await Database.account(plr, "");
    } else if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      acc = await Database.account(plr, "");
    } else {
      await interaction.deferReply();
      acc = await Database.account(interaction.options.getString("player"), interaction.user.id);
    }
  }

  if (acc == undefined) {
    return new CommandResponse("", ERROR_UNLINKED);
  }

  let embed;
  let buttons;

  switch (map.toLowerCase()) {
    case "bb": {
      embed = createBadBloodEmbed(acc);
      buttons = ZombiesButtons("bb", acc.uuid);
      break;
    }

    case "de": {
      embed = createDeadEndEmbed(acc);
      buttons = ZombiesButtons("de", acc.uuid);
      break;
    }

    case "aa": {
      embed = createAlienArcadiumEmbed(acc);
      buttons = ZombiesButtons("aa", acc.uuid);
      break;
    }

    default: {
      embed = createDefaultEmbed(acc);
      buttons = ZombiesButtons("o", acc.uuid);
      break;
    }
  }

  return new CommandResponse("", embed, undefined, buttons);
});
