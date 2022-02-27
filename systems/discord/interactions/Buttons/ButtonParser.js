const { ButtonInteraction, Interaction } = require("discord.js");
const ButtonGenerator = require("./ButtonGenerator");
const ButtonResponse = require("./ButtonResponse");
const { readFile } = require("fs-extra");

let commandStorage;

let ezmsgs;

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {Interaction} interaction
 * @returns {ButtonResponse}
 */
async function statsHandler(accUUID, time = "lifetime", game, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const res = await commands.gameStats.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", undefined, res.components, [res.file]);
}

/**
 * @param {ButtonInteraction} interaction
 * @param {string} leaderboard
 * @param {string} time
 * @param {number} index
 * @returns {ButtonResponse}
 */
async function leaderboardHandler(interaction, leaderboard, time, index) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const res = await commands.Leaderboard.execute([leaderboard, time, index], interaction.user.id, undefined, interaction);

  if (res == undefined) {
    return;
  }

  return new ButtonResponse("", undefined, res?.components, [res?.file]);
}

/**
 * @returns {ButtonResponse}
 */
async function ezHandler() {
  if (ezmsgs == undefined) {
    const file = await readFile("data/ez");
    ezmsgs = file.toString().split("\n");
  }
  const msg = ezmsgs[Math.floor(Math.random() * ezmsgs.length)];
  const buttons = await ButtonGenerator.getEZ();
  return new ButtonResponse(msg, undefined, buttons);
}

/**
 *
 * @param {string} accUUID
 * @param {string} map
 * @param {ButtonInteraction} interaction
 * @returns {ButtonResponse}
 */
async function zombiesHandler(accUUID, map, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const zombiesRes = await commands.Zombies.execute([accUUID, map], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", [zombiesRes.embed], zombiesRes.components);
}

/**
 *
 * @param {string} accUUID
 * @param {string} timetype
 * @param {ButtonInteraction} interaction
 * @returns {ButtonResponse}
 */
async function topGamesHandler(accUUID, timetype, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const topGamesRes = await commands.TopGames.execute([accUUID, timetype], interaction.user.id, undefined, interaction);

  if (topGamesRes == undefined) {
    return;
  }

  return new ButtonResponse("", undefined, topGamesRes?.components, [topGamesRes?.file]);
}

/**
 *
 * @param {string} accUUID
 * @param {string} timetype
 * @param {ButtonInteraction} interaction
 * @returns {ButtonResponse}
 */
async function miwHandler(accUUID, timetype, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();
  await interaction.deferUpdate();
  const miwRes = await commands.MiniWalls.execute([accUUID, timetype], interaction.user.id, undefined, interaction);
  if (miwRes == undefined) {
    return;
  }

  return new ButtonResponse("", undefined, miwRes.components, [miwRes.file]);
}

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {Interaction} interaction
 * @returns {ButtonResponse}
 */
async function pgHandler(accUUID, time, game, interaction) {
  if (commandStorage == undefined) {
    commandStorage = await import("../../CommandStorage.mjs");
    await commandStorage.default.initCommands();
  }
  const commands = await commandStorage.default.getCommands();

  const pgRes = await commands.PartyGames.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", undefined, pgRes.components, [pgRes.file]);
}

/**
 *
 * @param {ButtonInteraction} interaction
 * @returns {ButtonResponse}
 */
module.exports = async function ButtonParser(interaction) {
  const data = interaction.customId.split(":");
  const commandType = data[0];
  switch (commandType) {
    case "lb": {
      return await leaderboardHandler(interaction, data[1], data[2], data[3]);
    }

    case "s": {
      return await statsHandler(data[1], data[2], data[3], interaction);
    }

    case "pg": {
      return pgHandler(data[1], data[2], data[3], interaction);
    }

    case "ez": {
      return await ezHandler();
    }

    case "z": {
      return await zombiesHandler(data[1], data[2], interaction);
    }

    case "t": {
      return await topGamesHandler(data[1], data[2], interaction);
    }

    case "mw": {
      return await miwHandler(data[1], data[2], interaction);
    }
  }
};
