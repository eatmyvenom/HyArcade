const Discord = require("discord.js");
const config = require("hyarcade-config").fromJSON();

/**
 * 
 */
module.exports = async function StatusExit () {
  const hook = new Discord.WebhookClient({ url: config.discord.statusHook });

  const embed = new Discord.MessageEmbed()
    .setTitle("Bot exit")
    .setColor(0xddddff)
    .setDescription("Bots are currently exiting and will be unable to reply.");

  await hook.send({ embeds: [embed], username: "Bot Status" });
};