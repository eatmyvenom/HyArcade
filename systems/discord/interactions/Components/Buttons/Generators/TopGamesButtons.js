const { MessageButton, MessageActionRow } = require("discord.js");

/**
 * @param currentTime
 * @param uuid
 * @returns {MessageActionRow}
 */
function TopGamesButtons(currentTime, uuid) {
  const lifetime = new MessageButton()
    .setCustomId(`t:${uuid}:l`)
    .setLabel("Lifetime")
    .setStyle("SUCCESS")
    .setDisabled(currentTime == "lifetime");

  const day = new MessageButton()
    .setCustomId(`t:${uuid}:d`)
    .setLabel("Daily")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "day");

  const weekly = new MessageButton()
    .setCustomId(`t:${uuid}:w`)
    .setLabel("Weekly")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "weekly");

  const monthly = new MessageButton()
    .setCustomId(`t:${uuid}:m`)
    .setLabel("Monthly")
    .setStyle("SECONDARY")
    .setDisabled(currentTime == "monthly");

  const row = new MessageActionRow().addComponents(lifetime, day, weekly, monthly);

  return row;
}

module.exports = TopGamesButtons;
