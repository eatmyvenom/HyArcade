const {
  ButtonInteraction, Interaction
} = require("discord.js");
const Logger = require("hyarcade-logger");
const BotRuntime = require("../../BotRuntime");
const Leaderboard = require("../../Commands/Leaderboard");
const miwCommand = require("../../Commands/MiniWalls");
const AccountComparitor = require("../../Utils/AccountComparitor");
const MenuGenerator = require("../SelectionMenus/MenuGenerator");
const ButtonGenerator = require("./ButtonGenerator");
const ButtonResponse = require("./ButtonResponse");

let zombies = undefined;
let topGames = undefined;
let partyGames = undefined;

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @returns {ButtonResponse}
 */
module.exports = async function ButtonParser (interaction) {
  const data = interaction.customId.split(":");
  const commandType = data[0];
  switch(commandType) {
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

  case "mw" : {
    return await miwHandler(data[1], data[2], interaction);
  }
  }
};

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {Interaction} interaction
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
 * @param {ButtonInteraction} interaction
 * @param {string} leaderboard
 * @param {string} time
 * @param {number} index
 * @returns {ButtonResponse}
 */
async function leaderboardHandler (interaction, leaderboard, time, index) {
  const res = await Leaderboard.execute(
    [leaderboard, time, index],
    interaction.user.id,
    undefined,
    interaction
  );
  return new ButtonResponse("", undefined, res.components, [res.file]);
}

/**
 * @returns {ButtonResponse}
 */
async function ezHandler () {
  const msgs = await BotRuntime.getFromDB("ezmsgs");
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
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
async function zombiesHandler (accUUID, map, interaction) {

  if(zombies == undefined) {
    zombies = await import("../../Commands/Zombies.mjs");
  }

  const zombiesRes = await zombies.default.execute([accUUID, map], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", [zombiesRes.embed], zombiesRes.components);
}


/**
 * 
 * @param {string} accUUID 
 * @param {string} timetype 
 * @param {ButtonInteraction} interaction 
 * @returns {ButtonResponse}
 */
async function topGamesHandler (accUUID, timetype, interaction) {
  if(topGames == undefined) {
    topGames = await import("../../Commands/TopGames.mjs");
  }

  const topGamesRes = await topGames.default.execute([accUUID, timetype], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", undefined, topGamesRes.components, [ topGamesRes.file ]);
}

/**
 * 
 * @param {string} accUUID 
 * @param {string} timetype 
 * @param {ButtonInteraction} interaction 
 * @returns {ButtonResponse}
 */
async function miwHandler (accUUID, timetype, interaction) {
  const miwRes = await miwCommand.execute([accUUID, timetype], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", [ miwRes.embed ], miwRes.components);
}

/**
 * @param {string} accUUID
 * @param {string} time
 * @param {string} game
 * @param {Interaction} interaction
 * @returns {ButtonResponse}
 */
async function pgHandler (accUUID, time, game, interaction) {
  if(partyGames == undefined) {
    partyGames = await import("../../Commands/PartyGames.mjs");
  }

  const pgRes = await partyGames.default.execute([accUUID, game, time], interaction.user.id, undefined, interaction);

  return new ButtonResponse("", undefined, pgRes.components, [ pgRes.file ]);
}
