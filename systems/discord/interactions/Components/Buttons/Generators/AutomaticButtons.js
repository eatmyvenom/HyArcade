const { MessageActionRow, MessageButton, MessageButtonOptions } = require("discord.js");

/**
 * @param {string} command
 * @param {MessageButtonOptions[]} optionSets
 * @returns {MessageActionRow}
 */
function AutomaticButtons(command, optionSets) {
  let row = new MessageActionRow();

  for (const options of optionSets) {
    const button = new MessageButton(options);
    button.setCustomId(`${command}:${options.args.join(":")}`);
    row = row.addComponents(button);
  }

  return row;
}

module.exports = AutomaticButtons;
