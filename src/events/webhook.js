const config = require("../Config").fromJSON();
const Discord = require("discord.js");
const { MessageEmbed } = Discord;
const listUtils = require("../listUtils");
const logger = require("hyarcade-logger");
const fs = require("fs/promises");
const Runtime = require("../Runtime");
const utils = require("../utils");
const Account = require("hyarcade-requests/types/Account");

/**
 * Send text to a discord webhook
 *
 * @param {string} [content=""]
 * @param {string} [webhookID=config.webhook.id]
 * @param {string} [webhookToken=config.webhook.token]
 * @returns {null}
 */
async function sendToDiscord (content = "", webhookID = config.webhook.id, webhookToken = config.webhook.token) {
  if(content == "") {
    logger.err("Refusing to send empty message to webhook!");
    return;
  }
  const hook = new Discord.WebhookClient(webhookID, webhookToken);
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
async function sendBasic (content, webhook) {
  const hook = new Discord.WebhookClient(webhook.id, webhook.token);
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
async function sendBasicEmbed (content, embed, webhook) {
  try {
    const hook = new Discord.WebhookClient(webhook.id, webhook.token);
    await hook.send({
      embeds: embed,
      username: webhook.username,
      avatarURL: webhook.pfp,
    });
    await hook.destroy();
  } catch (e) {
    logger.err(e.stack);
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
async function sendToEmbedDiscord (txt, list, webhookID = config.webhook.id, webhookToken = config.webhook.token) {
  const hook = new Discord.WebhookClient(webhookID, webhookToken);
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
async function sendEmbed (embed, webhook) {
  const hook = new Discord.WebhookClient(webhook.id, webhook.token);
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
async function sendPGEmbed () {
  await sendEmbed(await genPGEmbed(), config.webhook);
}

/**
 *
 */
async function sendHSEmbed () {
  await sendEmbed(await genHSEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendHSWEmbed () {
  await sendEmbed(await genHSWEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendHSMEmbed () {
  await sendEmbed(await genHSMEmbed(), config.otherHooks.HS);
}

/**
 *
 */
async function sendPGWEmbed () {
  const hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
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
async function sendPGMEmbed () {
  const hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token);
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
async function sendTOKillEmbed () {
  const hook = new Discord.WebhookClient(config.otherHooks.TO.id, config.otherHooks.TO.token);
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
 * Do not look at this... I need a better solution
 * TODO: fix
 *
 * @param {*} list
 * @returns {*}
 */
function generateEmbed (list) {
  const filteredList = list.filter((item) => item.wins > 0);

  const embed = new Discord.MessageEmbed().setTitle("Daily Leaderboard")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now());

  let str = "";

  const len = Math.min(filteredList.length, 24);
  for(let i = 0; i < len; i += 1) {
    str += `${i + 1}) ${filteredList[i].name} - ${filteredList[i].wins}\n`;
  }
  embed.setDescription(str);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genPGEmbed () {
  const alltime = await listUtils.stringLB("wins", 25);
  const day = await listUtils.stringLBDaily("wins", 25);

  const embed = new Discord.MessageEmbed()
    .setTitle("Party games leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Top lifetime wins -------------", alltime, true)
    .addField("--------------- Top daily wins --------------", day, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genTOKillEmbed () {
  const alltime = await listUtils.stringLB("throwOutKills", 10, "extras");

  const embed = new Discord.MessageEmbed()
    .setTitle("Throw out leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("------------- Top lifetime kills -------------", alltime, true);

  return embed;
}

/**
 * @returns {Discord.MessageEmbed}
 */
async function genPGWEmbed () {
  const week = await listUtils.stringLBDiff("wins", 25, "weekly");

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
async function genPGMEmbed () {
  const month = await listUtils.stringLBDiff("wins", 25, "monthly");

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
async function genHSEmbed () {
  const alltime = await listUtils.stringLB("hypixelSaysWins", 25);
  const day = await listUtils.stringLBDaily("hypixelSaysWins", 25);

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
async function genHSWEmbed () {
  const week = await listUtils.stringLBDiff("hypixelSaysWins", 25, "weekly");

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
async function genHSMEmbed () {
  const month = await listUtils.stringLBDiff("hypixelSaysWins", 25, "monthly");

  const embed = new Discord.MessageEmbed()
    .setTitle("Hypixel says leaderboards")
    .setColor(0x44a3e7)
    .setTimestamp(Date.now())
    .addField("-------------- Top monthly wins -------------", month, true);

  return embed;
}

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function wComp (b, a) {
  return (a?.miniWallsWins ?? 0) - (b?.miniWallsWins ?? 0);
}

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function kComp (b, a) {
  return (a?.miniWalls?.kills ?? 0) - (b?.miniWalls?.kills ?? 0);
}

/**
 * @param {Account} b
 * @param {Account} a
 * @returns {number}
 */
function dComp (b, a) {
  return (a?.miniWalls?.deaths ?? 0) - (b?.miniWalls?.deaths ?? 0);
}

/**
 * @param {Account} n
 * @param {Account} o
 * @returns {Account}
 */
function cb (n, o) {
  o.miniWallsWins = (n?.miniWallsWins ?? 0) - (o?.miniWallsWins ?? 0);
  o.miniWalls.kills = (n?.miniWalls?.kills ?? 0) - (o?.miniWalls?.kills ?? 0);
  o.miniWalls.deaths = (n?.miniWalls?.deaths ?? 0) - (o?.miniWalls?.deaths ?? 0);
  o.miniWalls.witherDamage = (n?.miniWalls?.witherDamage ?? 0) - (o?.miniWalls?.witherDamage ?? 0);
  o.miniWalls.witherKills = (n?.miniWalls?.witherKills ?? 0) - (o?.miniWalls?.witherKills ?? 0);
  o.miniWalls.finalKills = (n?.miniWalls?.finalKills ?? 0) - (o.miniWalls?.finalKills ?? 0);
  return o;
}

/**
 * @param {Account} n
 * @returns {Account}
 */
function rcb (n) {
  return n;
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
async function hackerTransformer (list) {
  const hackerlist = (await fs.readFile("data/hackerlist")).toString().split("\n");
  let filteredList = list.filter((a) => !hackerlist.includes(a.uuid));
  filteredList = filteredList.filter((a) => a != {});
  filteredList = filteredList.filter((a) => a.name != undefined);
  return filteredList;
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
function top150Transformer (list) {
  let filterdList = list.sort(wComp);
  filterdList = list.slice(0, Math.min(filterdList.length, 150));
  return filterdList;
}

/**
 * @param {Account[]} list
 * @returns {Account[]}
 */
async function ratioTransformer (list) {
  let filteredList = await hackerTransformer(list);
  filteredList = await top150Transformer(filteredList);
  return filteredList;
}

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @returns {Discord.MessageEmbed}
 */
async function getLB (prop, timetype, limit) {
  let res = "";
  let time;

  let comparitor = null;
  let callback = cb;
  let transformer = hackerTransformer;
  let parser = null;
  switch(prop) {
  case "miniWallsWins": {
    comparitor = wComp;
    parser = (a) => a.miniWallsWins;
    break;
  }

  case "kills": {
    comparitor = kComp;
    parser = (a) => a.miniWalls.kills;
    break;
  }

  case "deaths": {
    comparitor = dComp;
    parser = (a) => a.miniWalls.deaths;
    break;
  }

  case "witherDamage": {
    comparitor = (b, a) => (a?.miniWalls?.witherDamage ?? 0) - (b?.miniWalls?.witherDamage ?? 0);
    parser = (a) => a?.miniWalls?.witherDamage ?? 0;
    break;
  }
  case "witherKills": {
    comparitor = (b, a) => (a?.miniWalls?.witherKills ?? 0) - (b?.miniWalls?.witherKills ?? 0);
    parser = (a) => a?.miniWalls?.witherKills ?? 0;
    break;
  }
  case "finalKills": {
    comparitor = (b, a) => (a?.miniWalls?.finalKills ?? 0) - (b?.miniWalls?.finalKills ?? 0);
    parser = (a) => a?.miniWalls?.finalKills ?? 0;
    break;
  }

  case "kd": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (
      ((a?.miniWalls?.kills ?? 0) + (a?.miniWalls?.finalKills ?? 0)) / (a?.miniWalls?.deaths ?? 0) -
                ((b?.miniWalls?.kills ?? 0) + (b?.miniWalls?.finalKills ?? 0)) / (b?.miniWalls?.deaths ?? 0)
    );
    parser = (a) => (((a?.miniWalls?.kills ?? 0) + (a?.miniWalls?.finalKills ?? 0)) / (a?.miniWalls?.deaths ?? 0)).toFixed(3);
    break;
  }

  case "kdnf": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (a?.miniWalls?.kills ?? 0) / (a?.miniWalls?.deaths ?? 0) - (b?.miniWalls?.kills ?? 0) / (b?.miniWalls?.deaths ?? 0);
    parser = (a) => ((a?.miniWalls?.kills ?? 0) / (a?.miniWalls?.deaths ?? 0)).toFixed(3);
    break;
  }

  case "fd": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (a?.miniWalls?.finalKills ?? 0) / (a?.miniWalls?.deaths ?? 0) - (b?.miniWalls?.finalKills ?? 0) / (b?.miniWalls?.deaths ?? 0);
    parser = (a) => ((a?.miniWalls?.finalKills ?? 0) / (a?.miniWalls?.deaths ?? 0)).toFixed(3);
    break;
  }

  case "wdd": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (a?.miniWalls?.witherDamage ?? 0) / (a?.miniWalls?.deaths ?? 0) - (b?.miniWalls?.witherDamage ?? 0) / (b?.miniWalls?.deaths ?? 0);
    parser = (a) => ((a?.miniWalls?.witherDamage ?? 0) / (a?.miniWalls?.deaths ?? 0)).toFixed(3);
    break;
  }

  case "wkd": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (a?.miniWalls?.witherKills ?? 0) / (a?.miniWalls?.deaths ?? 0) - (b?.miniWalls?.witherKills ?? 0) / (b?.miniWalls?.deaths ?? 0);
    parser = (a) => ((a?.miniWalls?.witherKills ?? 0) / (a?.miniWalls?.deaths ?? 0)).toFixed(3);
    break;
  }

  case "aa": {
    callback = rcb;
    transformer = ratioTransformer;
    comparitor = (b, a) => (a?.miniWalls?.arrowsHit ?? 0) / (a?.miniWalls?.arrowsShot ?? 0) - (b?.miniWalls?.arrowsHit ?? 0) / (b?.miniWalls?.arrowsShot ?? 0);
    parser = (a) => (((a?.miniWalls?.arrowsHit ?? 0) / (a?.miniWalls?.arrowsShot ?? 0)) * 100).toFixed(3);
    break;
  }
  }

  switch(timetype) {
  case "d":
  case "day":
  case "daily": {
    time = "Daily";
    res = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", callback, transformer);
    break;
  }

  case "w":
  case "week":
  case "weak":
  case "weekly": {
    time = "Weekly";
    res = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", callback, transformer);
    break;
  }

  case "m":
  case "mon":
  case "month":
  case "monthly": {
    time = "Monthly";
    res = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", callback, transformer);
    break;
  }

  case "a":
  case "all":
  case "*": {
    let day = await listUtils.stringDiffAdv(comparitor, parser, limit, "day", callback, transformer);
    let week = await listUtils.stringDiffAdv(comparitor, parser, limit, "weekly", callback, transformer);
    let month = await listUtils.stringDiffAdv(comparitor, parser, limit, "monthly", callback, transformer);
    const life = await listUtils.stringLBAdv(comparitor, parser, limit, transformer);

    day = day == "" ? "Nobody has won" : day;
    week = week == "" ? "Nobody has won" : week;
    month = month == "" ? "Nobody has won" : month;

    const embed = new MessageEmbed()
      .setColor(0x984daf)
      .addField("Daily", day, true)
      .addField("Weekly", week, true)
      .addField("\u200B", "\u200B", true)
      .addField("Monthly", month, true)
      .addField("Lifetime", life, true)
      .addField("\u200B", "\u200B", true);

    return embed;
  }

  default: {
    time = "Lifetime";
    res = await listUtils.stringLBAdv(comparitor, parser, limit, transformer);
    break;
  }
  }

  res = res != "" ? res : "Nobody has won.";
  const embed = new MessageEmbed().setTitle(time)
    .setColor(0xc60532)
    .setDescription(res);

  if(res.length > 6000) {
    return new MessageEmbed()
      .setTitle("ERROR")
      .setColor(0xff0000)
      .setDescription(
        "You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!"
      );
  }

  if(res.length > 2000) {
    let resArr = res.trim().split("\n");
    embed.setDescription("");
    while(resArr.length > 0) {
      const end = Math.min(25, resArr.length);
      embed.addField("\u200b", resArr.slice(0, end).join("\n"), false);
      resArr = resArr.slice(end);
    }
  }

  return embed;
}

/**
 * @param {string} prop
 * @param {number} a
 * @returns {Discord.MessageEmbed}
 */
async function getMW (prop, a) {
  return await getLB(prop, "l", a);
}

/**
 * @param {number} number
 * @returns {string}
 */
function formatNum (number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 *
 */
async function sendMW () {
  const run = Runtime.fromJSON();
  const { mwMsg } = run;

  let guildlist = await utils.readJSON("guild.json");
  guildlist.sort((a, b) => b.miniWallsWins - a.miniWallsWins);

  let str = "";
  guildlist = guildlist.filter((g) => g.uuid != "5cf6ddfb77ce842c855426b0");
  for(let i = 0; i < Math.min(10, guildlist.length); i += 1) {
    const g = guildlist[i];
    str += `${i + 1}) **${g.name}** (${formatNum(g.miniWallsWins)})\n`;
  }

  const gEmbed = new MessageEmbed()
    .setTitle("Lifetime Guild Wins")
    .setDescription(str)
    .setColor(0xc60532);

  const wins = await getMW("miniWallsWins", 25);
  const kills = await getMW("kills", 10);
  const finals = await getMW("finalKills", 10);
  const witherdmg = await getMW("witherDamage", 10);
  const witherkills = await getMW("witherKills", 10);
  const guilds = gEmbed;

  wins.setTitle("Lifetime Wins");
  kills.setTitle("Lifetime Kills");
  finals.setTitle("Lifetime Finals");
  witherdmg.setTitle("Lifetime Wither Damage");
  witherkills.setTitle("Lifetime Wither Kills");
  const hook = new Discord.WebhookClient(config.otherHooks.MW.id, config.otherHooks.MW.token);
  try {
    await hook.deleteMessage(mwMsg);
  } catch (e) {
    logger.err(e);
  }
  const newMsg = await hook.send({
    embeds: [wins, kills, finals, witherdmg, witherkills, guilds],
    username: config.otherHooks.MW.username,
    avatarURL: config.otherHooks.MW.pfp,
  });

  run.mwMsg = newMsg.id;
  await run.save();
}

module.exports = {
  send: sendToDiscord,
  sendEmbed: sendToEmbedDiscord,
  sendBasic,
  sendBasicEmbed,
  generateEmbed,
  genPGEmbed,
  sendPGEmbed,
  sendPGWEmbed,
  sendPGMEmbed,
  sendHSEmbed,
  sendHSWEmbed,
  sendHSMEmbed,
  sendTOKillEmbed,
  sendMW,
};
