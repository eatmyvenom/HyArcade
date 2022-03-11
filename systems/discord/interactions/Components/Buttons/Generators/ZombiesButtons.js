const { MessageButton, MessageActionRow } = require("discord.js");

/**
 * @param {string} currentGame
 * @param {string} uuid
 * @returns {MessageActionRow}
 */
function ZombiesButtons(currentGame, uuid) {
  const o = new MessageButton()
    .setCustomId(`z:${uuid}:o`)
    .setLabel("Overall")
    .setStyle("PRIMARY")
    .setDisabled(currentGame == "o");

  const aa = new MessageButton()
    .setCustomId(`z:${uuid}:aa`)
    .setLabel("Alien Arcadium")
    .setStyle("SECONDARY")
    .setDisabled(currentGame == "aa");

  const bb = new MessageButton()
    .setCustomId(`z:${uuid}:bb`)
    .setLabel("Bad Blood")
    .setStyle("SECONDARY")
    .setDisabled(currentGame == "bb");

  const de = new MessageButton()
    .setCustomId(`z:${uuid}:de`)
    .setLabel("Dead End")
    .setStyle("SECONDARY")
    .setDisabled(currentGame == "de");

  const row = new MessageActionRow().addComponents(o, bb, de, aa);

  return row;
}

module.exports = ZombiesButtons;
