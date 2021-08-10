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

  if(acc.uuid == undefined) {
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

  const stats =
        `Wins: **${formatN(acc?.miniWallsWins ?? 0)}**\n` +
        `Kills: **${formatN(acc?.miniWalls?.kills ?? 0)}**\n` +
        `Finals: **${formatN(acc?.miniWalls?.finalKills ?? 0)}**\n` +
        `Wither Damage: **${formatN(acc?.miniWalls?.witherDamage ?? 0)}**\n` +
        `Wither Kills: **${formatN(acc?.miniWalls?.witherKills ?? 0)}**\n` +
        `Deaths: **${formatN(acc?.miniWalls?.deaths ?? 0)}**\n`;

  const deaths = acc?.miniWalls?.deaths ?? 0;
  const ratios =
        `K/D: **${formatR(((acc?.miniWalls?.kills ?? 0) + (acc?.miniWalls?.finalKills ?? 0)) / deaths)}**\n` +
        `K/D (no finals): **${formatR((acc?.miniWalls?.kills ?? 0) / deaths)}**\n` +
        `F/D: **${formatR((acc?.miniWalls?.finalKills ?? 0) / deaths)}**\n` +
        `WD/D: **${formatR((acc?.miniWalls?.witherDamage ?? 0) / deaths)}**\n` +
        `WK/D: **${formatR((acc?.miniWalls?.witherKills ?? 0) / deaths)}**\n` +
        `Arrow Accuracy: **${formatR(((acc?.miniWalls?.arrowsHit ?? 0) / (acc?.miniWalls?.arrowsShot ?? 0)) * 100)}**\n`;

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
