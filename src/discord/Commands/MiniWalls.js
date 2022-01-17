const Account = require("hyarcade-requests/types/Account");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const ImageGenerator = require("../images/ImageGenerator");
const ButtonGenerator = require("../interactions/Buttons/ButtonGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const Database = require("../Utils/Database");
const { ERROR_WAS_NOT_IN_DATABASE } = require("../Utils/Embeds/DynamicEmbeds");
const {
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
 * @returns {string}
 */
function formatR (n) {
  let r = Math.round(n * 1000) / 1000;
  if(isNaN(r)) {
    r = "N/A";
  } else {
    r = r.toFixed(3);
  }
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
 * 
 * @param {string[]} args 
 * @param {object} rawMsg 
 * @param {object} interaction 
 * @returns {object}
 */
async function miniWallsStats (args, rawMsg, interaction) {
  let plr = args[0];
  let time = args[1] ?? "lifetime";

  if(args.length == 1) {
    time = "lifetime";
    if(plr.length == 1) {
      time = plr;
      plr = "!";
    }
  }

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
  if(interaction == undefined || interaction.isButton()) {
    const res = await Database.timedAccount(plr, "", time);
    if(time != "lifetime") {
      acc = res?.acc;
      timed = res?.timed;
      if(timed == undefined) {
        return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(acc?.name ?? plr));
      }
    } else {
      acc = res;
    }
  } else {
    const res = await Database.timedAccount(interaction.options.getString("player"), interaction.user.id, time);
    if(time != "lifetime") {
      acc = res?.acc;
      timed = res?.timed;
      if(timed == undefined) {
        return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(acc?.name ?? plr));
      }
    } else {
      acc = res;
    }
  }

  if(await isHacker(acc)) {
    return {};
  }

  if(acc?.uuid == undefined || acc?.name == "INVALID-NAME" || acc?.miniWalls == undefined) {
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

  const img = new ImageGenerator(2560, 1600, "'Fira Code Bold'");
  img.context.beginPath();
  img.context.rect(0, 0, 2560, 1600);
  img.context.fillStyle = "#181c30";
  img.context.fill();

  const gradient = img.context.createLinearGradient(0, 0, img.canvas.width, img.canvas.height);
  gradient.addColorStop(0, "#FF5555");
  gradient.addColorStop(0.40, "#55FF55");
  gradient.addColorStop(0.60, "#FFFF55");
  gradient.addColorStop(1, "#00AAFF");

  img.context.beginPath();
  img.context.rect(1, 1, 2559, 1599);
  img.context.strokeStyle = gradient;
  img.context.lineWidth = 20;
  img.context.stroke();

  img.writeText("Mini Walls Stats", 1280, 100, "center", "#FFFFFF", "112px");
  img.writeAcc(acc, undefined, 220, "112px");

  const fontSize = "96px";
  const increment = 200;
  const leftAlign = "left";
  const rightAlign = "right";
  const leftX = 100;
  const rightX = 2460;
  const winColor = gradient;
  const killColor = gradient;
  const witherColor = gradient;
  const deathColor = gradient;
  const aaColor = gradient;

  let y = 250;
  img.writeText(`Wins: ${formatN(wins ?? 0)}`, leftX, y += increment, leftAlign, winColor, fontSize);
  img.writeText(`Kills: ${formatN(kills ?? 0)}`, leftX, y += increment, leftAlign, killColor, fontSize);
  img.writeText(`Finals: ${formatN(finalKills ?? 0)}`, leftX, y += increment, leftAlign, killColor, fontSize);
  img.writeText(`Wither Damage: ${formatN(witherDamage ?? 0)}`, leftX, y += increment, leftAlign, witherColor, fontSize);
  img.writeText(`Wither Kills: ${formatN(witherKills ?? 0)}`, leftX, y += increment, leftAlign, witherColor, fontSize);
  img.writeText(`Deaths: ${formatN(deaths ?? 0)}`, leftX, y += increment, leftAlign, deathColor, fontSize);

  y = 250;
  img.writeText(`K/D: ${formatR(((kills ?? 0) + (finalKills ?? 0)) / deaths)}`, rightX, y += increment, rightAlign, killColor, fontSize);
  img.writeText(`K/D (no finals): ${formatR((kills ?? 0) / deaths)}`, rightX, y += increment, rightAlign, killColor, fontSize);
  img.writeText(`F/D: ${formatR((finalKills ?? 0) / deaths)}`, rightX, y += increment, rightAlign, killColor, fontSize);
  img.writeText(`WD/D: ${formatR((witherDamage ?? 0) / deaths)}`, rightX, y += increment, rightAlign, witherColor, fontSize);
  img.writeText(`WK/D: ${formatR((witherKills ?? 0) / deaths)}`, rightX, y += increment, rightAlign, witherColor, fontSize);
  img.writeText(`Arrow Accuracy: ${formatR(((arrowsHit ?? 0) / (arrowsShot ?? 0)) * 100)}`, rightX, y += increment, rightAlign, aaColor, fontSize);

  return new CommandResponse("", undefined, img.toDiscord(), await ButtonGenerator.getMiw(time, acc.uuid));
}

module.exports = new Command("mini-walls", ["*"], miniWallsStats, 2500);
