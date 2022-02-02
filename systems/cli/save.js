const task = require("../../src/cluster/task");

/**
 *
 * @returns {*}
 */
async function main() {
  await task.accounts();
  await task.guilds();
}

module.exports = main;
