const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const {
  ERROR_NEED_PLAYER,
  ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");

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

module.exports = new Command("mini-walls", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  let acc;
  if(interaction == undefined) {
    acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 1);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction, 0);
  }

  const hackers = await BotUtils.getFromDB("hackerlist");
  if(hackers.includes(acc?.uuid?.toLowerCase())) {
    return {};
  }

  if(acc.uuid == undefined && acc.name != "INVALID-NAME") {
    return {
      res: "",
      embed: ERROR_NEED_PLAYER
    };
  }

  if(acc.miniWalls == undefined) {
    return {
      res: "",
      embed: ERROR_IGN_UNDEFINED
    };
  }

  const { wins, kills, finalKills, witherDamage, witherKills, deaths, arrowsHit, arrowsShot } = acc?.miniWalls;

  const stats =
        `Wins: **${formatN(wins ?? 0)}**\n` +
        `Kills: **${formatN(kills ?? 0)}**\n` +
        `Finals: **${formatN(finalKills ?? 0)}**\n` +
        `Wither Damage: **${formatN(witherDamage ?? 0)}**\n` +
        `Wither Kills: **${formatN(witherKills ?? 0)}**\n` +
        `Deaths: **${formatN(deaths ?? 0)}**\n`;

  const ratios =
        `K/D: **${formatR(((kills ?? 0) + (finalKills ?? 0)) / deaths)}**\n` +
        `K/D (no finals): **${formatR((kills ?? 0) / deaths)}**\n` +
        `F/D: **${formatR((finalKills ?? 0) / deaths)}**\n` +
        `WD/D: **${formatR((witherDamage ?? 0) / deaths)}**\n` +
        `WK/D: **${formatR((witherKills ?? 0) / deaths)}**\n` +
        `Arrow Accuracy: **${formatR(((arrowsHit ?? 0) / (arrowsShot ?? 0)) * 100)}**\n`;

  const embed = new MessageEmbed()
    .setTitle(`Player: ${acc?.name}`)
    .setColor(0x7873f5)
    .addField("━━━━━━ Stats: ━━━━━", stats, true)
    .addField("━━━━━ Ratios: ━━━━━", ratios, true);

  return {
    res: "",
    embed
  };
});
