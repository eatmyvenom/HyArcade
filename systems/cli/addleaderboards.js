const task = require("../../src/cluster/task");

/**
 *
 */
async function main() {
  await task.addLeaderboards();
}

module.exports = main;