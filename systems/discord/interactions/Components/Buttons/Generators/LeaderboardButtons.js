const { MessageActionRow, MessageButton } = require("discord.js");

/**
 * @param currentIndex
 * @param lb
 * @param time
 * @returns {MessageActionRow}
 */
function LeaderboardButtons(currentIndex, lb, time) {
  const left = new MessageButton()
    .setCustomId(`lb:${lb}:${time}:${currentIndex - 10}`)
    .setLabel("    ⟵")
    .setStyle("SECONDARY");

  const right = new MessageButton()
    .setCustomId(`lb:${lb}:${time}:${currentIndex + 10}`)
    .setLabel("⟶    ")
    .setStyle("SECONDARY");

  if (currentIndex - 10 < 0) {
    left.setDisabled(true);
  }

  const row = new MessageActionRow().addComponents(left, right);

  return row;
}

module.exports = LeaderboardButtons;
