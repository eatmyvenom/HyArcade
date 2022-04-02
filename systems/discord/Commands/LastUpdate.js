const { MessageEmbed } = require("discord.js");
const fs = require("fs-extra");
const Command = require("@hyarcade/structures/Discord/Command");

/**
 *
 * @returns {object}
 */
async function lastUpdateHandler() {
  let time;
  time = fs.existsSync("timeupdate") ? Date.parse(await fs.readFile("timeupdate")) : Date.now();

  time = Math.floor(time / 1000);

  const embed = new MessageEmbed().setTitle("Update time").setDescription(`<t:${time}:d> <t:${time}:T> -- <t:${time}:R>`).setColor(0x00b37b);

  return {
    res: "",
    embed,
  };
}

module.exports = new Command(["lastupdate", "catlock", "timeupdate", "updatetime", "update-time"], ["*"], lastUpdateHandler, 2500);
