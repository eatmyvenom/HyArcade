const Discord = require("discord.js");
const config = require("@hyarcade/config").fromJSON();

/**
 *
 */
module.exports = async function StatusStart() {
  const hook = new Discord.WebhookClient({ url: config.discord.statusHook });

  const embed = new Discord.MessageEmbed()
    .setTitle("Database Starting...")
    .setColor(0x44a3e7)
    .setDescription(
      "Database is starting and will be ready shortly. Bots and webpages will be unable to reply during until all data is cached, please wait.",
    );

  await hook.send({ embeds: [embed] });
};
