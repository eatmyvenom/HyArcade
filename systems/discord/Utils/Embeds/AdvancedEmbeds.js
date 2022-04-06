const { MessageEmbed, User } = require("discord.js");

class AdvancedEmbeds {
  /**
   *
   * @param {string} ign
   * @param {User} user
   * @returns {MessageEmbed}
   */
  playerLink(ign, user) {
    const embed = new MessageEmbed()
      .setTitle("Success")
      .setColor(0x00cc66)
      .setDescription(`<@${user.id}> was linked as ${ign}`)
      .setFooter({ text: `${user.id}` });

    return embed;
  }
}

module.exports = new AdvancedEmbeds();
