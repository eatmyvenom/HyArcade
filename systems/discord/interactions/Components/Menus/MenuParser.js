const { SelectMenuInteraction } = require("discord.js");
const ComponentResponse = require("../ComponentResponse");

let commandStorage;

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ComponentResponse}
 */
async function statsHandler(accUUID, time, game, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const res = await commands.GameStats.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ComponentResponse("", undefined, res.components, [res.file]);
}

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ComponentResponse}
 */
async function partyGamesHandler(accUUID, time, game, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }

  const commands = await commandStorage.default.getCommands();

  const pgRes = await commands.PartyGames.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ComponentResponse("", undefined, pgRes.components, [pgRes.file]);
}

/**
 * @param {string} accUUID
 * @param {string} game
 * @param {SelectMenuInteraction} interaction
 * @returns {ComponentResponse}
 */
async function apHandler(accUUID, game, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }

  const commands = await commandStorage.default.getCommands();

  const apRes = await commands.ArcadeAP.execute([accUUID, game], interaction.user.id, undefined, interaction);
  return new ComponentResponse("", [apRes.embed], apRes.components);
}

/**
 *
 * @param {SelectMenuInteraction} interaction
 * @returns {Promise<ComponentResponse>}
 */
module.exports = async function MenuParser(interaction) {
  const data = interaction.customId.split(":");
  const commandType = data[0];
  switch (commandType) {
    case "s": {
      return await statsHandler(data[1], data[2], interaction.values[0], interaction);
    }

    case "ap": {
      return await apHandler(data[1], interaction.values[0], interaction);
    }

    case "pg": {
      return await partyGamesHandler(data[1], data[2], interaction.values[0], interaction);
    }
  }
};
