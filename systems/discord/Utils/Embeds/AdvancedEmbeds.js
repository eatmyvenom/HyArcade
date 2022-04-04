const { MessageEmbed, User } = require("discord.js");

module.exports = class AdvancedEmbeds {
  /**
   *
   * @param {string} ign
   * @param {User} user
   * @returns {MessageEmbed}
   */
  static playerLink(ign, user) {
    const embed = new MessageEmbed()
      .setTitle("Success")
      .setColor(0x00cc66)
      .setDescription(`<@${user.id}> was linked as ${ign}`)
      .setFooter({ text: `${user.id}` });

    return embed;
  }
};
