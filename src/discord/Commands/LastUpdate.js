const Command = require("../../classes/Command");
const fs = require("fs/promises");
const {
  MessageEmbed
} = require("discord.js");
const utils = require("../../utils");

/**
 * 
 * @returns {object}
 */
async function lastUpdateHandler () {
  let time;
  if(utils.fileExists("timeupdate")) {
    time = Date.parse(await (await fs.readFile("timeupdate")).toString());
  } else {
    time = Date.now();
  }

  time = Math.floor(time / 1000);

  const embed = new MessageEmbed().setTitle("Update time")
    .setDescription(`<t:${time}:d> <t:${time}:T> -- <t:${time}:R>`)
    .setColor(0x00b37b);

  return {
    res: "",
    embed
  };
}

module.exports = new Command(["lastupdate", "catlock", "timeupdate", "updatetime"], ["*"], lastUpdateHandler, 2500);
