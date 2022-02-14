/* eslint-disable no-use-before-define */
const Discord = require("discord.js");
const config = require("hyarcade-config").fromJSON();
const { MessageEmbed } = Discord;
const logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const Json = require("hyarcade-utils/FileHandling/Json");
const FakeLB = require("../discord/images/FakeLB");
const listUtils = require("hyarcade-utils/listUtils");
const { stringifyList } = require("hyarcade-utils/Leaderboards/ListUtils");

/**
 * Send text to a discord webhook
 *
 * @param {string} [content=""]
 * @param {string} [webhookID=config.webhook.id]
 * @param {string} [webhookToken=config.webhook.token]
 * @returns {null}
 */
async function sendToDiscord(content = "", webhookID = config.webhook.id, webhookToken = config.webhook.token) {
  if (content == "") {
    logger.err("Refusing to send empty message to webhook!");
    return;
  }
  const hook = new Discord.WebhookClient({ id: webhookID, token: webhookToken });
  await hook.send({
    content,
    username: config.webhook.username,
    avatarURL: config.webhook.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  await hook.destroy();
}

/**
 * @param {string} content
 * @param {object} webhook
 */
async function sendBasic(content, webhook) {
  const hook = new Discord.WebhookClient({ id: webhook.id, token: webhook.token });
  await hook.send({
    content,
    username: webhook.username,
    avatarURL: webhook.pfp,
  });
  await hook.destroy();
}

/**
 * @param {string} content
 * @param {Discord.MessageEmbed} embed
 * @param {object} webhook
 */
async function sendBasicEmbed(content, embed, webhook) {
  try {
    const hook = new Discord.WebhookClient({ id: webhook.id, token: webhook.token });
    await hook.send({
      embeds: embed,
      username: webhook.username,
      avatarURL: webhook.pfp,
    });
    await hook.destroy();
  } catch (error) {
    logger.err(error.stack);
  }
}

/**
 * Send text and a list to a discord webhook to be embedded
 *
 * @param {string} txt
 * @param {string[]} list
 * @param {string} [webhookID=config.webhook.id]
 * @param {string} [webhookToken=config.webhook.token]
 */
async function sendToEmbedDiscord(txt, list, webhookID = config.webhook.id, webhookToken = config.webhook.token) {
  const hook = new Discord.WebhookClient({ id: webhookID, token: webhookToken });
  await hook.send({
    embeds: [generateEmbed(list)],
    username: config.webhook.username,
    avatarURL: config.webhook.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  hook.destroy();
}

/**
 * @param {MessageEmbed} embed
 * @param {object} webhook
 */
async function sendEmbed(embed, webhook) {
  const hook = new Discord.WebhookClient({ id: webhook.id, token: webhook.token });
  await hook.send({
    embeds: [embed],
    username: webhook.username,
    avatarURL: webhook.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  await hook.destroy();
}

/**
 *
 */
async function sendHSEmbed() {
  await sendEmbed(await genHSEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendHSWEmbed() {
  await sendEmbed(await genHSWEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendHSMEmbed() {
  await sendEmbed(await genHSMEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendPGWEmbed() {
  const hook = new Discord.WebhookClient({ id: config.webhook.id, token: config.webhook.token });
  await hook.send({
    embeds: [await genPGWEmbed()],
    username: config.webhook.username,
    avatarURL: config.webhook.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  hook.destroy();
}

/**
 *
 */
async function sendPGMEmbed() {
  const hook = new Discord.WebhookClient({ id: config.webhook.id, token: config.webhook.token });
  await hook.send({
    embeds: [await genPGMEmbed()],
    username: config.webhook.username,
    avatarURL: config.webhook.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  hook.destroy();
}

/**
 *
 */
async function sendTOKillEmbed() {
  const hook = new Discord.WebhookClient({ id: config.otherHooks.TO.id, token: config.otherHooks.TO.token });
  await hook.send({
    embeds: [await genTOKillEmbed()],
    username: config.otherHooks.TO.username,
    avatarURL: config.otherHooks.TO.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  hook.destroy();
}

/**
 *
 */
async function sendDWKillEmbed() {
  const hook = new Discord.WebhookClient({ id: config.otherHooks.DW.id, token: config.otherHooks.DW.token });
  await hook.send({
    embeds: [await genDWKillEmbed()],
    username: config.otherHooks.TO.username,
    avatarURL: config.otherHooks.TO.pfp,
  });
  // this closes the hook client so the nodejs doesnt hang
  // forever
  hook.destroy();
}

/**
 * Do not look at this... I need a better solution
 * TODO: fix
 *
 * @param {*} list
 * @returns {*}
 */
function generateEmbed(list) {
  const filteredList = list.filter(item => item.wins > 0);

  const embed = new Discord.MessageEmbed().setTitle("Daily Leaderboard").setColor(0x44a3e7).setTimestamp(Date.now());

  let str = "";

  const len = Math.min(filteredList.length, 24);
  for (let i = 0; i < len; i += 1) {
    str += `${i + 1}) ${filteredList[i].name} - ${filteredList[i].wins}\n`;
  }
  embed.setDescription(str);

  return embed;
}

/**
 * @returns {Promise}
 */
async function sendPGEmbed() {
  const lifeWinsList = await Database.getLeaderboard("wins", "partyGames", undefined, true);
  const dayWinsList = await Database.getLeaderboard("wins", "partyGames", "day", true);
  const lifeWins = stringifyList(lifeWinsList, "wins", "partyGames", 25);
  const dayWins = stringifyList(dayWinsList, "lbProp", undefined, 25);

  const lifeRList = await Database.getLeaderboard("roundsWon", "partyGames", undefined, true);
  const dayRList = await Database.getLeaderboard("roundsWon", "partyGames", "day", true);
  const lifeR = stringifyList(lifeRList, "roundsWon", "partyGames", 25);
  const dayR = stringifyList(dayRList, "lbProp", undefined, 25);

  const lifeSList = await Database.getLeaderboard("starsEarned", "partyGames", undefined, true);
  const daySList = await Database.getLeaderboard("starsEarned", "partyGames", "day", true);
  const lifeS = stringifyList(lifeSList, "starsEarned", "partyGames", 25);
  const dayS = stringifyList(daySList, "lbProp", undefined, 25);

  const Wins = new Discord.MessageEmbed()
    .setTitle("Party games Wins")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Lifetime -------------", lifeWins, true)
    .addField("--------------- Daily --------------", dayWins, true);

  const rounds = new Discord.MessageEmbed()
    .setTitle("Party games Rounds")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Lifetime -------------", lifeR, true)
    .addField("--------------- Daily --------------", dayR, true);

  const stars = new Discord.MessageEmbed()
    .setTitle("Party games Stars")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Lifetime -------------", lifeS, true)
    .addField("--------------- Daily --------------", dayS, true);

  const hook = new Discord.WebhookClient({ id: config.webhook.id, token: config.webhook.token });
  await hook.send({
    embeds: [Wins, rounds, stars],
    username: config.username,
    avatarURL: config.webhook.pfp,
  });
  hook.destroy();
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genTOKillEmbed() {
  const killList = await Database.getLeaderboard("kills", "throwOut", undefined, true);
  const alltime = stringifyList(killList, "kills", "throwOut", 10);

  const embed = new Discord.MessageEmbed()
    .setTitle("Throw Out leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Top lifetime Kills -------------", alltime, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genDWKillEmbed() {
  const killList = await Database.getLeaderboard("kills", "dragonWars", undefined, true);
  const alltime = stringifyList(killList, "kills", "dragonWars", 10);

  const embed = new Discord.MessageEmbed()
    .setTitle("Dragon Wars Leaderboard")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Top lifetime kills -------------", alltime, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genPGWEmbed() {
  const week = await listUtils.stringLBDiff("wins", 25, "weekly", "partyGames");

  const embed = new Discord.MessageEmbed()
    .setTitle("Party games leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("-------------- Top weekly wins --------------", week, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genPGMEmbed() {
  const month = await listUtils.stringLBDiff("wins", 25, "monthly", "partyGames");

  const embed = new Discord.MessageEmbed()
    .setTitle("Party games leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("-------------- Top monthly wins -------------", month, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genHSEmbed() {
  const lifeList = await Database.getLeaderboard("wins", "hypixelSays", undefined, true);
  const alltime = stringifyList(lifeList, "wins", "hypixelSays", 10);
  const dayList = await Database.getLeaderboard("wins", "hypixelSays", "day", true);
  const day = stringifyList(dayList, "lbprop", undefined, 10);

  const embed = new Discord.MessageEmbed()
    .setTitle("Hypixel says leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Top lifetime wins -------------", alltime, true)
    .addField("--------------- Top daily wins --------------", day, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genHSWEmbed() {
  const week = await listUtils.stringLBDiff("wins", 25, "weekly", "hypixelSays");

  const embed = new Discord.MessageEmbed()
    .setTitle("Hypixel says leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("-------------- Top weekly wins --------------", week, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genHSMEmbed() {
  const month = await listUtils.stringLBDiff("wins", 25, "monthly", "hypixelSays");

  const embed = new Discord.MessageEmbed()
    .setTitle("Hypixel says leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("-------------- Top monthly wins -------------", month, true);

  return embed;
}

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @returns {Promise<object>}
 */
async function getLB(prop, timetype, limit) {
  let res = [];
  let time;

  switch (timetype) {
    case "d":
    case "day":
    case "daily": {
      time = "Daily";
      res = await Database.getMWLeaderboard(prop, "day");
      res = res.slice(0, limit);
      break;
    }

    case "w":
    case "week":
    case "weak":
    case "weekly": {
      time = "Weekly";
      res = await Database.getMWLeaderboard(prop, "weekly");
      res = res.slice(0, limit);
      break;
    }

    case "m":
    case "mon":
    case "month":
    case "monthly": {
      time = "Monthly";
      res = await Database.getMWLeaderboard(prop, "monthly");
      res = res.slice(0, limit);
      break;
    }

    default: {
      time = "Lifetime";
      res = await Database.getMWLeaderboard(prop);
      res = res.slice(0, limit);
      break;
    }
  }

  return { res, time };
}

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @returns {Discord.MessageEmbed}
 */
async function genMiWLB(prop, timetype, limit) {
  const startTime = Date.now();
  const type = prop;

  let correctedTime = "";
  let res = "";
  let gameName = "";

  switch (type.toLowerCase()) {
    case "k":
    case "kill":
    case "kil":
    case "kills": {
      gameName = "Kills";
      const lb = await getLB("kills", timetype, limit);
      res = stringifyList(lb.res, "kills", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "d":
    case "dead":
    case "ded":
    case "death":
    case "deaths": {
      gameName = "Deaths";
      const lb = await getLB("deaths", timetype, limit);
      res = stringifyList(lb.res, "deaths", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "wd":
    case "witherd":
    case "witherdamage":
    case "witherhurted":
    case "damagewither":
    case "witherdmg": {
      gameName = "Wither Damage";
      const lb = await getLB("witherDamage", timetype, limit);
      res = stringifyList(lb.res, "witherDamage", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "wk":
    case "witherskilled":
    case "killwither":
    case "witherk":
    case "witherkill":
    case "witherki8lls": {
      gameName = "Wither Kills";
      const lb = await getLB("witherKills", timetype, limit);
      res = stringifyList(lb.res, "witherKills", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "f":
    case "fk":
    case "finalkill":
    case "fkill":
    case "final":
    case "finals": {
      gameName = "Final Kills";
      const lb = await getLB("finalKills", timetype, limit);
      res = stringifyList(lb.res, "finalKills", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "tkd":
    case "tkdr":
    case "totalkd":
    case "ttlkd":
    case "totalkdr":
    case "f+kd":
    case "f+kdr":
    case "k+fdr":
    case "k+fd":
    case "kfdr":
    case "killdeath": {
      gameName = "Kills+Finals/Deaths";
      const lb = await getLB("kd", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "kd":
    case "k/d":
    case "k/dr":
    case "kdr":
    case "kdnf":
    case "nfkd":
    case "nfkdr":
    case "kdrnf":
    case "kdnofinal": {
      gameName = "Kills/Deaths ratios";
      const lb = await getLB("kdnf", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "fdr":
    case "f/d":
    case "fkd":
    case "fkdr":
    case "finaldeath":
    case "fd": {
      const lb = await getLB("fd", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "wdd":
    case "wdr":
    case "wddr":
    case "witherdamagedeath": {
      gameName = "Wither Damage/Deaths";
      const lb = await getLB("wdd", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "wkd":
    case "wkdr":
    case "wk/d":
    case "witherkilldeath":
    case "witherkill+d":
    case "wikdr": {
      gameName = "Wither Kills/Deaths";
      const lb = await getLB("wkd", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    case "aa":
    case "arrowacc":
    case "ahm":
    case "arrowhit/miss": {
      gameName = "Arrow accuracy";
      const lb = await getLB("aa", timetype, limit);
      res = stringifyList(lb.res, "ratio", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }

    default: {
      gameName = "Wins";
      const lb = await getLB("wins", timetype, limit);
      res = stringifyList(lb.res, "wins", "miniWalls", limit);
      correctedTime = lb.time;
      break;
    }
  }

  res = res != "" ? res : "Leaderboard empty...";

  const embed = new MessageEmbed()
    .setTitle(correctedTime)
    .setColor(0xc60532)
    .setDescription(res)
    .setAuthor({ name: `${gameName} Leaderboard`, iconURL: "https://vnmm.dev/share/images/MWPfp3.png" });

  if (res.length > 6000) {
    return new MessageEmbed()
      .setTitle("ERROR")
      .setColor(0xff0000)
      .setDescription("You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!");
  }

  if (res.length > 2000) {
    let resArr = res.trim().split("\n");
    embed.setDescription("");
    while (resArr.length > 0) {
      const end = Math.min(25, resArr.length);
      embed.addField("\u200B", resArr.slice(0, end).join("\n"), false);
      resArr = resArr.slice(end);
    }
  }

  logger.out(`MW Leaderboard command ran in ${Date.now() - startTime}ms`);

  return embed;
}

/**
 * @param {number} number
 * @returns {string}
 */
function formatNum(number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 */
async function sendMW() {
  let guildlist = await Json.read("guild.json");
  guildlist.sort((a, b) => b.miniWallsWins - a.miniWallsWins);

  let str = "";
  guildlist = guildlist.filter(g => g.uuid != "5cf6ddfb77ce842c855426b0");
  for (let i = 0; i < Math.min(10, guildlist.length); i += 1) {
    const g = guildlist[i];
    str += `${` \`${i + 1}.`.padEnd(4)}\` **${g.name}** (\`${formatNum(g.miniWallsWins)}\`)\n`;
  }

  const gEmbed = new MessageEmbed().setTitle("Lifetime Guild Wins").setDescription(str).setColor(0xc60532);

  const wins = await genMiWLB("wins", "l", 25);
  const kills = await genMiWLB("kills", "l", 10);
  const finals = await genMiWLB("f", "l", 10);
  const witherdmg = await genMiWLB("wd", "l", 10);
  const witherkills = await genMiWLB("wk", "l", 10);
  const guilds = gEmbed;

  const hook = new Discord.WebhookClient({ id: config.otherHooks.MW.id, token: config.otherHooks.MW.token });

  await hook.editMessage(config.discord.miniWalls.lbMsg, {
    content: `Updated <t:${Math.floor(Date.now() / 1000)}:R>`,
    embeds: [wins, kills, finals, witherdmg, witherkills, guilds],
    username: config.otherHooks.MW.username,
    avatarURL: "https://vnmm.dev/share/images/MWPfp3.png",
  });
}

/**
 * Generate and send fake weekly lb sses
 */
async function sendFakeWeekLBs() {
  const blockingDead = await FakeLB("wins", "blockingDead", "weekly");
  const bountyHunters = await FakeLB("wins", "bountyHunters", "weekly");
  const dragonWars = await FakeLB("wins", "dragonWars", "weekly");
  const enderSpleef = await FakeLB("wins", "enderSpleef", "weekly");
  const farmhunt = await FakeLB("wins", "farmhunt", "weekly");
  const football = await FakeLB("wins", "football", "weekly");
  const galaxyWars = await FakeLB("wins", "galaxyWars", "weekly");
  const hideAndSeek = await FakeLB("wins", "hideAndSeek", "weekly");
  const holeInTheWall = await FakeLB("wins", "holeInTheWall", "weekly");
  const hypixelSays = await FakeLB("wins", "hypixelSays", "weekly");
  const miniWalls = await FakeLB("wins", "miniWalls", "weekly");
  const partyGames = await FakeLB("wins", "partyGames", "weekly");
  const pixelPainters = await FakeLB("wins", "pixelPainters", "weekly");
  const throwOut = await FakeLB("wins", "throwOut", "weekly");
  const zombies = await FakeLB("wins_zombies", "zombies", "weekly");
  const coins = await FakeLB("arcadeCoins", undefined, "weekly");

  const bd = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.bd });
  await bd.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [blockingDead],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bd.destroy();

  const bh = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.bh });
  await bh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [bountyHunters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bh.destroy();

  const dw = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.dw });
  await dw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [dragonWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  dw.destroy();

  const es = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.es });
  await es.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [enderSpleef],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  es.destroy();

  const fh = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.fh });
  await fh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [farmhunt],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fh.destroy();

  const fb = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.fb });
  await fb.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [football],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fb.destroy();

  const gw = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.gw });
  await gw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [galaxyWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  gw.destroy();

  const hns = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.hns });
  await hns.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hideAndSeek],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hns.destroy();

  const hitw = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.hitw });
  await hitw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [holeInTheWall],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hitw.destroy();

  const hs = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.hs });
  await hs.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hypixelSays],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hs.destroy();

  const miw = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.miw });
  await miw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [miniWalls],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  miw.destroy();

  const pg = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.pg });
  await pg.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [partyGames],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pg.destroy();

  const pp = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.pp });
  await pp.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [pixelPainters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pp.destroy();

  const to = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.to });
  await to.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [throwOut],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  to.destroy();

  const z = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.z });
  await z.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [zombies],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  z.destroy();

  const c = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.c });
  await c.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [coins],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  c.destroy();
}

/**
 * Generate and send fake monthly lb sses
 */
async function sendFakeMonthLBs() {
  const blockingDead = await FakeLB("wins", "blockingDead", "monthly");
  const bountyHunters = await FakeLB("wins", "bountyHunters", "monthly");
  const dragonWars = await FakeLB("wins", "dragonWars", "monthly");
  const enderSpleef = await FakeLB("wins", "enderSpleef", "monthly");
  const farmhunt = await FakeLB("wins", "farmhunt", "monthly");
  const football = await FakeLB("wins", "football", "monthly");
  const galaxyWars = await FakeLB("wins", "galaxyWars", "monthly");
  const hideAndSeek = await FakeLB("wins", "hideAndSeek", "monthly");
  const holeInTheWall = await FakeLB("wins", "holeInTheWall", "monthly");
  const hypixelSays = await FakeLB("wins", "hypixelSays", "monthly");
  const miniWalls = await FakeLB("wins", "miniWalls", "monthly");
  const partyGames = await FakeLB("wins", "partyGames", "monthly");
  const pixelPainters = await FakeLB("wins", "pixelPainters", "monthly");
  const throwOut = await FakeLB("wins", "throwOut", "monthly");
  const zombies = await FakeLB("wins_zombies", "zombies", "monthly");
  const coins = await FakeLB("arcadeCoins", undefined, "monthly");

  const bd = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.bd });
  await bd.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [blockingDead],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bd.destroy();

  const bh = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.bh });
  await bh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [bountyHunters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bh.destroy();

  const dw = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.dw });
  await dw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [dragonWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  dw.destroy();

  const es = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.es });
  await es.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [enderSpleef],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  es.destroy();

  const fh = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.fh });
  await fh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [farmhunt],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fh.destroy();

  const fb = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.fb });
  await fb.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [football],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fb.destroy();

  const gw = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.gw });
  await gw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [galaxyWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  gw.destroy();

  const hns = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.hns });
  await hns.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hideAndSeek],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hns.destroy();

  const hitw = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.hitw });
  await hitw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [holeInTheWall],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hitw.destroy();

  const hs = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.hs });
  await hs.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hypixelSays],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hs.destroy();

  const miw = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.miw });
  await miw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [miniWalls],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  miw.destroy();

  const pg = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.pg });
  await pg.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [partyGames],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pg.destroy();

  const pp = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.pp });
  await pp.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [pixelPainters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pp.destroy();

  const to = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.to });
  await to.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [throwOut],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  to.destroy();

  const z = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.z });
  await z.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [zombies],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  z.destroy();

  const c = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.c });
  await c.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [coins],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  c.destroy();
}

/**
 * Generate and send fake weekly lb sses
 */
async function sendFakeLifetimeLBs() {
  const blockingDead = await FakeLB("wins", "blockingDead");
  const bountyHunters = await FakeLB("wins", "bountyHunters");
  const dragonWars = await FakeLB("wins", "dragonWars");
  const enderSpleef = await FakeLB("wins", "enderSpleef");
  const farmhunt = await FakeLB("wins", "farmhunt");
  const football = await FakeLB("wins", "football");
  const galaxyWars = await FakeLB("wins", "galaxyWars");
  const hideAndSeek = await FakeLB("wins", "hideAndSeek");
  const holeInTheWall = await FakeLB("wins", "holeInTheWall");
  const hypixelSays = await FakeLB("wins", "hypixelSays");
  const miniWalls = await FakeLB("wins", "miniWalls");
  const partyGames = await FakeLB("wins", "partyGames");
  const pixelPainters = await FakeLB("wins", "pixelPainters");
  const throwOut = await FakeLB("wins", "throwOut");
  const zombies = await FakeLB("wins_zombies", "zombies");
  const coins = await FakeLB("arcadeCoins");
  const gexp = await FakeLB("arcadeEXP", "guild");

  const bd = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.bd });
  await bd.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [blockingDead],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bd.destroy();

  const bh = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.bh });
  await bh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [bountyHunters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  bh.destroy();

  const dw = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.dw });
  await dw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [dragonWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  dw.destroy();

  const es = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.es });
  await es.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [enderSpleef],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  es.destroy();

  const fh = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.fh });
  await fh.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [farmhunt],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fh.destroy();

  const fb = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.fb });
  await fb.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [football],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  fb.destroy();

  const gw = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.gw });
  await gw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [galaxyWars],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  gw.destroy();

  const hns = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.hns });
  await hns.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hideAndSeek],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hns.destroy();

  const hitw = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.hitw });
  await hitw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [holeInTheWall],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hitw.destroy();

  const hs = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.hs });
  await hs.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [hypixelSays],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  hs.destroy();

  const miw = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.miw });
  await miw.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [miniWalls],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  miw.destroy();

  const pg = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.pg });
  await pg.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [partyGames],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pg.destroy();

  const pp = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.pp });
  await pp.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [pixelPainters],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  pp.destroy();

  const to = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.to });
  await to.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [throwOut],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  to.destroy();

  const z = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.z });
  await z.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [zombies],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  z.destroy();

  const c = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.c });
  await c.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [coins],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  c.destroy();

  const g = new Discord.WebhookClient({ url: config.discord.lbarchive.lifetime.g });
  await g.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [gexp],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  g.destroy();
}

/**
 *
 */
async function sendFakeMonthGEXP() {
  const gexp = await FakeLB("arcadeEXP", "guild", "monthly");
  const g = new Discord.WebhookClient({ url: config.discord.lbarchive.monthly.g });
  await g.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [gexp],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  g.destroy();
}

/**
 *
 */
async function sendFakeWeekGEXP() {
  const gexp = await FakeLB("arcadeEXP", "guild", "weekly");
  const g = new Discord.WebhookClient({ url: config.discord.lbarchive.weekly.g });
  await g.send({
    content: `<t:${Math.floor(Date.now() / 1000)}:F>`,
    files: [gexp],
    username: "Leaderboard Screenshotter",
    avatarURL: "https://i.vnmm.dev/arcadedisc.png",
  });
  g.destroy();
}

/**
 *
 */
async function sendFakeMiwLB() {
  const lb = await FakeLB();
  const sb = new Discord.WebhookClient({ url: config.discord.mwFakeLB });

  await sb.send({ files: [lb] });
}

module.exports = {
  send: sendToDiscord,
  sendEmbed: sendToEmbedDiscord,
  sendFakeWeekLBs,
  sendFakeLifetimeLBs,
  sendFakeMonthLBs,
  sendFakeWeekGEXP,
  sendFakeMonthGEXP,
  sendBasic,
  sendBasicEmbed,
  generateEmbed,
  sendPGEmbed,
  sendPGWEmbed,
  sendPGMEmbed,
  sendHSEmbed,
  sendHSWEmbed,
  sendHSMEmbed,
  sendTOKillEmbed,
  sendDWKillEmbed,
  sendFakeMiwLB,
  sendMW,
};
