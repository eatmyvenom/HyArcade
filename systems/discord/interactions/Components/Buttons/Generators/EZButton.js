const { MessageButton, MessageActionRow } = require("discord.js");

/**
 * @returns {MessageActionRow}
 */
function EZButton() {
  const ez = new MessageButton().setCustomId("ez:null").setLabel("EZ").setStyle("SECONDARY");

  const row = new MessageActionRow().addComponents(ez);

  return row;
}

module.exports = EZButton;
