/* eslint-disable camelcase */
const { AutocompleteInteraction } = require("discord.js");
const Logger = require("@hyarcade/logger");
const Database = require("@hyarcade/database");
const { Account } = require("@hyarcade/structures");
const LeaderboardCategorys = require("./AutoComplete/LeaderboardCategorys");
const LeaderboardStats = require("./AutoComplete/LeaderboardStats");

/**
 * @type {Account}
 */
let testStats;

const zombies = {
  fastest_time_10_zombies_alienarcadium_normal: true,
  fastest_time_10_zombies: true,
  fastest_time_20_zombies_alienarcadium_normal: true,
  fastest_time_20_zombies: true,
  fastest_time_10_zombies_badblood_normal: true,
  fastest_time_20_zombies_badblood_normal: true,
  fastest_time_10_zombies_deadend_normal: true,
  fastest_time_20_zombies_deadend_normal: true,
  fastest_time_30_zombies: true,
  fastest_time_30_zombies_deadend_normal: true,
  fastest_time_30_zombies_badblood_normal: true,
  fastest_time_10_zombies_badblood_hard: true,
  fastest_time_20_zombies_badblood_hard: true,
  fastest_time_30_zombies_badblood_hard: true,
  fastest_time_10_zombies_badblood_rip: true,
  fastest_time_20_zombies_badblood_rip: true,
  fastest_time_10_zombies_deadend_hard: true,
  fastest_time_20_zombies_deadend_hard: true,
  fastest_time_30_zombies_badblood_rip: true,
  fastest_time_10_zombies_deadend_rip: true,
  fastest_time_20_zombies_deadend_rip: true,
  fastest_time_30_zombies_deadend_rip: true,
  fastest_time_30_zombies_deadend_hard: true,
  fastest_time_30_zombies_alienarcadium_normal: true,
};

/**
 *
 * @param {AutocompleteInteraction} interaction
 * @returns {void}
 */
async function leaderboardFiller(interaction) {
  if (testStats == undefined) {
    testStats = await Database.account("vnmm");
    Object.assign(testStats.zombies, zombies);
  }

  const category = interaction.options.getString("category");
  const stat = interaction.options.getString("stat");

  switch (interaction.options.getFocused(true).name) {
    case "category": {
      LeaderboardCategorys(category, interaction, testStats);
      break;
    }

    case "stat": {
      LeaderboardStats(category, stat, interaction, testStats);
      break;
    }
  }
}

/**
 *
 */
async function startUp() {
  testStats = await Database.account("vnmm");
  Object.assign(testStats.zombies, zombies);
}

/**
 * @param {AutocompleteInteraction} interaction
 */
async function filler(interaction) {
  if (interaction.commandName == "leaderboard") {
    await leaderboardFiller(interaction);
  }
}

startUp()
  .then(() => {})
  .catch(error => Logger.err(error.stack));

module.exports = filler;
