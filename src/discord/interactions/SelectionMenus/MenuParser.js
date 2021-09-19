const {
  SelectMenuInteraction
} = require("discord.js");
const BotRuntime = require("../../BotRuntime");
const ButtonResponse = require("../Buttons/ButtonResponse");
const InteractionUtils = require("../InteractionUtils");
const MenuGenerator = require("./MenuGenerator");
const PartyGamesImg = require("../../images/PartyGamesImg");

/**
 * 
 * @param {SelectMenuInteraction} interaction 
 * @returns {Promise<ButtonResponse>}
 */
module.exports = async function MenuParser (interaction) {
  const data = interaction.customId.split(":");
  const commandType = data[0];
  switch(commandType) {
  case "s": {
    return await statsHandler(data[1], interaction.values[0], interaction);
  }

  case "pg" : {
    return await partyGamesHandler(data[1], interaction.values[0], interaction);
  }
  }
};

/**
 * @param {string} accUUID
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ButtonResponse}
 */
async function statsHandler (accUUID, game, interaction) {
  await interaction.deferUpdate();
  const accData = await InteractionUtils.accFromUUID(accUUID);
  const statsRes = await BotRuntime.getStats(accData, game);
  const {
    embed
  } = statsRes;

  const mnu = await MenuGenerator.statsMenu(accUUID);
  return new ButtonResponse("", [embed], mnu);
}

/**
 * @param {string} accUUID
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ButtonResponse}
 */
async function partyGamesHandler (accUUID, game, interaction) {
  await interaction.deferUpdate();
  const accData = await InteractionUtils.accFromUUID(accUUID);
  const img = await PartyGamesImg(accData, game);

  const mnu = await MenuGenerator.partyGamesMenu(accUUID);
  return new ButtonResponse("", undefined, mnu, [ img ]);
}