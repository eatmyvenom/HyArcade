const {
  SelectMenuInteraction
} = require("discord.js");
const BotRuntime = require("../../BotRuntime");
const ButtonResponse = require("../Buttons/ButtonResponse");
const MenuGenerator = require("./MenuGenerator");
const Logger = require("hyarcade-logger");
const AccountComparitor = require("../../Utils/AccountComparitor");

let partyGames = undefined;

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
    return await partyGamesHandler(data[1], data[2], interaction.values[0], interaction);
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

  const mnu = await MenuGenerator.statsMenu(accUUID, time, game);
  return new ButtonResponse("", [embed], mnu);
}

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ButtonResponse}
 */
async function partyGamesHandler (accUUID, time, game, interaction) {
  if(partyGames == undefined) {
    partyGames = await import("../../Commands/PartyGames.mjs");
  }

  const pgRes = await partyGames.default.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", undefined, pgRes.components, [ pgRes.file ]);
}