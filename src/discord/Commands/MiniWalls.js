const {
  MessageEmbed
} = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const {
  ERROR_NEED_PLAYER,
  ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");

/**
 * 
 * @param {Account} acc 
 * @returns {boolean}
 */
async function isHacker (acc) {
  const hackers = await BotRuntime.getHackerlist();
  return hackers.includes(acc?.uuid?.toLowerCase());
}

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
  let time = args[1] ?? "lifetime";

  switch (time.toLowerCase()) {
  case "d":
  case "day":
  case "dae":
  case "daily":
  case "today": {
    time = "day";
    break;
  }

  case "w":
  case "week":
  case "weak":
  case "weekly":
  case "weeekly": {
    time = "weekly";
    break;
  }

  case "m":
  case "monthly":
  case "month":
  case "mnth":
  case "mnthly":
  case "mon": {
    time = "monthly";
    break;
  }

  default: {
    time = "lifetime";
  }
  }

  let acc;
  let timed;
  if(interaction == undefined) {
    const res = await BotRuntime.resolveAccount(plr, rawMsg, args.length == 0, time);
    if(time != "lifetime") {
      acc = res.acc;
      timed = res.timed;
    } else {
      acc = res;
    }
  } else {
    acc = await InteractionUtils.resolveAccount(interaction, 0);
  }

  if(await isHacker(acc)) {
    return {};
  }

  if(acc?.uuid == undefined && acc?.name != "INVALID-NAME") {
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

  if(timed != undefined) {
    acc.miniWalls.wins -= timed?.miniWalls?.wins ?? 0;
    acc.miniWalls.kills -= timed?.miniWalls?.kills ?? 0;
    acc.miniWalls.finalKills -= timed?.miniWalls?.finalKills ?? 0;
    acc.miniWalls.witherDamage -= timed?.miniWalls?.witherDamage ?? 0;
    acc.miniWalls.witherKills -= timed?.miniWalls?.witherKills ?? 0;
    acc.miniWalls.deaths -= timed?.miniWalls?.deaths ?? 0;
    acc.miniWalls.arrowsHit -= timed?.miniWalls?.arrowsHit ?? 0;
    acc.miniWalls.arrowsShot -= timed?.miniWalls?.arrowsShot ?? 0;
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
