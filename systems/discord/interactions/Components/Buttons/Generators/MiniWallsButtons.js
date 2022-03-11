const { MessageActionRow, MessageButton } = require("discord.js");

/**
 * @param currentTime
 * @param uuid
 * @returns {MessageActionRow[]}
 */
function MiniWallsButtons(currentTime, uuid) {
  const lifetime = new MessageButton()
    .setCustomId(`mw:${uuid}:l`)
    .setLabel("Lifetime")
    .setStyle("PRIMARY")
    .setDisabled(currentTime == "lifetime");

  const day = new MessageButton()
    .setCustomId(`mw:${uuid}:d`)
    .setLabel("Daily")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "day");

  const weekly = new MessageButton()
    .setCustomId(`mw:${uuid}:w`)
    .setLabel("Weekly")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "weekly");

  const monthly = new MessageButton()
    .setCustomId(`mw:${uuid}:m`)
    .setLabel("Monthly")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "monthly");

  const row = new MessageActionRow().addComponents(lifetime, day, weekly, monthly);

  return [row];
}

module.exports = MiniWallsButtons;
