const { MessageEmbed } = require("discord.js");
//// const listUtils = require("../../listUtils");
const Database = require("../Database");

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @param {string} category
 * @param {number} start
 * @returns {Promise<MessageEmbed>}
 */
module.exports = async function GetLeaderboard (prop, timetype, limit, category, start) {
  let res = "";
  let time;

  switch(timetype) {
  case "d": {
    time = "Daily";
    res = await Database.getLeaderboard(prop, category, "day");
    if(start != undefined) {
      res = res.slice(start);
    }

    if(limit != undefined) {
      res = res.slice(0, limit);
    } else {
      res = res.slice(0, 10);
    }
    //// res = await listUtils.stringLBDiff(prop, limit, "day", category, start);
    break;
  }

  case "w": {
    time = "Weekly";
    res = await Database.getLeaderboard(prop, category, "weekly");
    if(start != undefined) {
      res = res.slice(start);
    }

    if(limit != undefined) {
      res = res.slice(0, limit);
    } else {
      res = res.slice(0, 10);
    }
    break;
  }

  case "m": {
    time = "Monthly";
    res = await Database.getLeaderboard(prop, category, "monthly");
    if(start != undefined) {
      res = res.slice(start);
    }

    if(limit != undefined) {
      res = res.slice(0, limit);
    } else {
      res = res.slice(0, 10);
    }
    break;
  }

  default: {
    time = "Lifetime";
    res = await Database.getLeaderboard(prop, category);
    if(start != undefined) {
      res = res.slice(start);
    }

    if(limit != undefined) {
      res = res.slice(0, limit);
    } else {
      res = res.slice(0, 10);
    }
    break;
  }
  }

  res = res != "" ? res : "Nobody has won.";
  const embed = new MessageEmbed()
    .setTitle(time)
    .setColor(0x00cc66)
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
};