const {
  SelectMenuInteraction
} = require("discord.js");
const BotRuntime = require("../../BotRuntime");
const ButtonResponse = require("../Buttons/ButtonResponse");
const InteractionUtils = require("../InteractionUtils");
const MenuGenerator = require("./MenuGenerator");
const PartyGamesImg = require("../../images/PartyGamesImg");
const Logger = require("hyarcade-logger");
const AccountComparitor = require("../../Utils/AccountComparitor");

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
    return await statsHandler(data[1], data[2], interaction.values[0], interaction);
  }

  case "pg" : {
    return await partyGamesHandler(data[1], interaction.values[0], interaction);
  }
  }
};

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ButtonResponse}
 */
async function statsHandler (accUUID, time, game, interaction) {
  await interaction.deferUpdate();
  let acc = await BotRuntime.resolveAccount(accUUID, undefined, false, time, false);

  if(acc.timed != undefined) {
    Logger.info("Getting account diff");
    const tmpAcc = AccountComparitor(acc.acc, acc.timed);

    acc = tmpAcc;
  }

  const statsRes = await BotRuntime.getStats(acc, game);
  const {
    embed
  } = statsRes;

  const mnu = await MenuGenerator.statsMenu(accUUID, time);
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