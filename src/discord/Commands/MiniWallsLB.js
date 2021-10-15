const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const Database = require("../Utils/Database");
const CommandResponse = require("../Utils/CommandResponse");
const { stringifyList } = require("../../utils/leaderboard/ListUtils");

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @returns {Promise<object>}
 */
async function getLB (prop, timetype, limit) {
  let res = [];
  let time;

  switch(timetype) {
  case "d":
  case "day":
  case "daily": {
    time = "Daily";
    res = await Database.getMWLeaderboard(prop, "day");
    res = res.slice(0, Math.min(limit, res.length));
    break;
  }

  case "w":
  case "week":
  case "weak":
  case "weekly": {
    time = "Weekly";
    res = await Database.getMWLeaderboard(prop, "weekly");
    res = res.slice(0, Math.min(limit, res.length));
    break;
  }

  case "m":
  case "mon":
  case "month":
  case "monthly": {
    time = "Monthly";
    res = await Database.getMWLeaderboard(prop, "monthly");
    res = res.slice(0, Math.min(limit, res.length));
    break;
  }

  default: {
    time = "Lifetime";
    res = await Database.getMWLeaderboard(prop);
    res = res.slice(0, Math.min(limit, res.length));
    break;
  }
  }

  return { res, time };
}

module.exports = new Command("mw-leaderboard", ["*"], async (args) => {
  const startTime = Date.now();
  const type = args[0] ?? "";
  const timetype = args[1] != undefined ? args[1] : "lifetime";
  let limit = args[args.length - 1] != undefined ? args[args.length - 1] : 10;
  if(new Number(limit) != limit) {
    limit = 10;
  }

  let correctedTime = "";
  let res = "";
  let gameName = "";

  switch(type.toLowerCase()) {
  case "k":
  case "kill":
  case "kil":
  case "kills": {
    gameName = "Kills";
    const lb = await getLB("kills", timetype, limit, "miniWalls");
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
    const lb = await getLB("deaths", timetype, limit, "miniWalls");
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
    const lb = await getLB("witherDamage", timetype, limit, "miniWalls");
    res = stringifyList(lb.res, "witherDamage", "miniWalls", limit);
    correctedTime = lb.time;
    break;
  }

  case "wk":
  case "witherskilled":
  case "killwither":
  case "witherk":
  case "witherkill":
  case "witherkills": {
    gameName = "Wither Kills";
    const lb = await getLB("witherKills", timetype, limit, "miniWalls");
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
    const lb = await getLB("finalKills", timetype, limit, "miniWalls");
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
    const lb = await getLB("kd", timetype, limit, "miniWalls");
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
    const lb = await getLB("kdnf", timetype, limit, "miniWalls");
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
    const lb = await getLB("fd", timetype, limit, "miniWalls");
    res = stringifyList(lb.res, "ratio", "miniWalls", limit);
    correctedTime = lb.time;
    break;
  }

  case "wdd":
  case "wdr":
  case "wddr":
  case "witherdamagedeath": {
    gameName = "Wither Damage/Deaths";
    const lb = await getLB("wdd", timetype, limit, "miniWalls");
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
    const lb = await getLB("wkd", timetype, limit, "miniWalls");
    res = stringifyList(lb.res, "ratio", "miniWalls", limit);
    correctedTime = lb.time;
    break;
  }

  case "aa":
  case "arrowacc":
  case "ahm":
  case "arrowhit/miss": {
    gameName = "Arrow accuracy";
    const lb = await getLB("aa", timetype, limit, "miniWalls");
    res = stringifyList(lb.res, "ratio", "miniWalls", limit);
    correctedTime = lb.time;
    break;
  }

  default: {
    gameName = "Wins";
    const lb = await getLB("wins", timetype, limit, "miniWalls");
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
    .setAuthor(`${gameName} Leaderboard`, "https://eatmyvenom.me/share/images/MWPfp3.png");

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

  logger.out(`MW Leaderboard command ran in ${Date.now() - startTime}ms`);

  return new CommandResponse("", embed);
}, 10000);
