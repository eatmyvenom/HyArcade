import Database from "@hyarcade/database";
import Logger from "@hyarcade/logger";
import Command from "@hyarcade/structures/Discord/Command.js";
import { createRequire } from "node:module";
import BotRuntime from "../BotRuntime.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";
import EmojiGetter from "../Utils/Formatting/EmojiGetter.js";

const require = createRequire(import.meta.url);
const { MessageEmbed } = require("discord.js");

/**
 * @param {number} n
 * @returns {number}
 */
function formatR(n) {
  const r = Math.round(n * 1000) / 1000;
  return r;
}

/**
 * @param {string} str
 * @returns {string}
 */
function formatN(str) {
  const r = Intl.NumberFormat("en").format(Number(str));
  return r;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {boolean} hasPerms
 * @returns {string}
 */
function clr(stat1, stat2, hasPerms) {
  if (stat1 > stat2) {
    return EmojiGetter(hasPerms, "better");
  } else if (stat1 == stat2) {
    return EmojiGetter(hasPerms, "neutral");
  }
  return EmojiGetter(hasPerms, "worse");
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineN(stat1, stat2, name, hasPerms) {
  return `${clr(stat1, stat2, hasPerms)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineNS(stat1, stat2, name, hasPerms) {
  return `${clr(stat2, stat1, hasPerms)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineR(stat1, stat2, name, hasPerms) {
  return `${clr(stat1, stat2, hasPerms)} **${name}**:\n${formatR(stat1)} | ${formatR(stat2)}\n`;
}

export default new Command(
  "mw-compare",
  ["*"],
  async (args, rawMsg, interaction) => {
    if (args.length === 0) {
      return {
        res: "",
        embed: ERROR_ARGS_LENGTH(1),
      };
    }

    const plr1 = args[0];
    const plr2 = args[1];
    let acc1;
    let acc2;
    if (interaction == undefined) {
      if (plr2 == undefined) {
        acc1 = await Database.account("", rawMsg.author.id);
        acc2 = await Database.account(plr1, "");
      } else {
        acc1 = await Database.account(plr1, rawMsg.author.id);
        acc2 = await Database.account(plr2, "");
      }
    } else {
      acc1 = await Database.account(interaction.options.getString("player1"), interaction.user.id);
      acc2 = await Database.account(interaction.options.getString("player2"), interaction.user.id);
    }

    const hackers = await BotRuntime.getHackerlist();

    if (hackers.includes(acc1.uuid)) {
      return {
        res: "",
        embed: ERROR_IGN_UNDEFINED,
      };
    }

    if (hackers.includes(acc2.uuid)) {
      return {
        res: "",
        embed: ERROR_IGN_UNDEFINED,
      };
    }

    const embed = new MessageEmbed();

    try {
      const deaths1 = acc1?.miniWalls?.deaths ?? 0;
      const deaths2 = acc2?.miniWalls?.deaths ?? 0;
      const kills1 = acc1?.miniWalls?.kills ?? 0;
      const kills2 = acc2?.miniWalls?.kills ?? 0;
      const fk1 = acc1?.miniWalls?.finalKills ?? 0;
      const fk2 = acc2?.miniWalls?.finalKills ?? 0;
      const wd1 = acc1?.miniWalls?.witherDamage ?? 0;
      const wd2 = acc2?.miniWalls?.witherDamage ?? 0;
      const wk1 = acc1?.miniWalls?.witherKills ?? 0;
      const wk2 = acc2?.miniWalls?.witherKills ?? 0;

      const stats =
        lineN(acc1?.miniWalls?.wins ?? 0, acc2?.miniWalls?.wins ?? 0, "Wins", true) +
        lineN(kills1, kills2, "Kills", true) +
        lineN(fk1, fk2, "Finals", true) +
        lineN(wd1, wd2, "Wither Damage", true) +
        lineN(wk1, wk2, "Wither Kills", true) +
        lineNS(deaths1, deaths2, "Deaths", true);

      const ratios =
        lineR((kills1 + fk1) / deaths1, (kills2 + fk2) / deaths2, "K/D", true) +
        lineR(kills1 / deaths1, kills2 / deaths2, "K/D (no finals)", true) +
        lineR(fk1 / deaths1, fk2 / deaths2, "F/D", true) +
        lineR(wd1 / deaths1, wd2 / deaths2, "WD/D", true) +
        lineR(wk1 / deaths1, wk2 / deaths2, "WK/D", true) +
        lineR(
          ((acc1?.miniWalls?.arrowsHit ?? 0) / (acc1?.miniWalls?.arrowsShot ?? 0)) * 100,
          ((acc2?.miniWalls?.arrowsHit ?? 0) / (acc2?.miniWalls?.arrowsShot ?? 0)) * 100,
          "Arrow Accuracy",
          true,
        );

      embed
        .setTitle(`${acc1.name} VS ${acc2.name}`)
        .setColor(0x7873f5)
        .addField("━━━━━━ Stats: ━━━━━", stats, true)
        .addField("━━━━━ Ratios: ━━━━━", ratios, true);
    } catch (error) {
      Logger.err(error.stack);
      return {
        res: "",
        embed: ERROR_IGN_UNDEFINED,
      };
    }

    return {
      res: "",
      embed,
    };
  },
  10000,
);
