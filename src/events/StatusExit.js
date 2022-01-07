const Discord = require("discord.js");
const config = require("hyarcade-config").fromJSON();

/**
 * 
 */
module.exports = async function StatusExit () {
  const hook = new Discord.WebhookClient({ url: config.discord.statusHook });

  const embed = new Discord.MessageEmbed()
    .setTitle("Database exit")
    .setColor(0xddddff)
    .setDescription("Database is exiting and will restart shortly. Bots and webpages will be unable to reply during this time!");

  await hook.send({ embeds: [embed] });
};