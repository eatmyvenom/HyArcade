const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const InteractionUtils = require("../interactions/InteractionUtils");
const {
  ERROR_ARGS_LENGTH
} = require("../Utils/Embeds/DynamicEmbeds");
const {
  ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");
const EmojiGetter = require("../Utils/Formatting/EmojiGetter");
const BotRuntime = require("../BotRuntime");

/**
 * @param {number} n
 * @returns {number}
 */
function formatR (n) {
  const r = Math.round(n * 1000) / 1000;
  return r;
}

/**
 * @param {string} str
 * @returns {string}
 */
function formatN (str) {
  const r = Intl.NumberFormat("en").format(Number(str));
  return r;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {boolean} hasPerms
 * @returns {string}
 */
function clr (stat1, stat2, hasPerms) {
  if(stat1 > stat2) {
    return EmojiGetter(hasPerms, "better");
  } else if(stat1 == stat2) {
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
function lineN (stat1, stat2, name, hasPerms) {
  return `${clr(stat1, stat2, hasPerms)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineNS (stat1, stat2, name, hasPerms) {
  return `${clr(stat2, stat1, hasPerms)} **${name}**:\n${formatN(stat1)} | ${formatN(stat2)}\n`;
}

/**
 * @param {number} stat1
 * @param {number} stat2
 * @param {string} name
 * @param {boolean} hasPerms
 * @returns {string}
 */
function lineR (stat1, stat2, name, hasPerms) {
  return `${clr(stat1, stat2, hasPerms)} **${name}**:\n${formatR(stat1)} | ${formatR(stat2)}\n`;
}

module.exports = new Command("mw-compare", ["*"], async (args, rawMsg, interaction) => {
  if(args.length < 1) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1)
    };
  }

  const plr1 = args[0];
  const plr2 = args[1];
  let acc1;
  let acc2;
  if(interaction == undefined) {
    if(plr2 == undefined) {
      acc1 = await BotRuntime.resolveAccount(null, rawMsg, true);
      acc2 = await BotRuntime.resolveAccount(plr1, rawMsg, false);
    } else {
      acc1 = await BotRuntime.resolveAccount(plr1, rawMsg, false);
      acc2 = await BotRuntime.resolveAccount(plr2, rawMsg, false);
    }
  } else {
    acc1 = await InteractionUtils.resolveAccount(interaction, 0);
    acc2 = await InteractionUtils.resolveAccount(interaction, 1);
  }

  const hackers = await BotRuntime.getHackerlist();

  if(hackers.includes(acc1.uuid)) {
    acc1 = {
      miniWallsWins: 0,
      miniWalls: {}
    };
  }

  if(hackers.includes(acc2.uuid)) {
    acc2 = {
      miniWallsWins: 0,
      miniWalls: {}
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
        "Arrow Accuracy", true
      );


    embed
      .setTitle(`${acc1.name} VS ${acc2.name}`)
      .setColor(0x7873f5)
      .addField("━━━━━━ Stats: ━━━━━", stats, true)
      .addField("━━━━━ Ratios: ━━━━━", ratios, true);

  } catch (e) {
    logger.err(e);
    return {
      res: "",
      embed: ERROR_IGN_UNDEFINED
    };
  }


  return {
    res: "",
    embed
  };
}, 10000);
