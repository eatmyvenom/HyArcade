const { MessageEmbed } = require("discord.js");

/**
 *
 * @param ign
 * @param user
 * @returns {MessageEmbed}
 */
function playerLink(ign, user) {
  const embed = new MessageEmbed()
    .setTitle("Success")
    .setColor(0x00cc66)
    .setDescription(`<@${user.id}> was linked as ${ign}`)
    .setFooter({ text: `${user.id}` });

  return embed;
}

module.exports = { playerLink };
