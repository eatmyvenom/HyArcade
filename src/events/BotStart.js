const Discord = require("discord.js");
const config = require("hyarcade-config").fromJSON();

/**
 *
 */
module.exports = async function StatusStart() {
  const hook = new Discord.WebhookClient({ url: config.discord.statusHook });

  const embed = new Discord.MessageEmbed()
    .setTitle("Bot Start")
    .setColor(0x44a3e7)
    .setDescription("Bots have started and can now reply.");

  await hook.send({ embeds: [embed], username: "Bot Status" });
};
