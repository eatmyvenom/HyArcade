const task = require("../task");

/**
 *
 * @returns {*}
 */
async function main() {
  await task.accounts();
  await task.guilds();
}

module.exports = main;
