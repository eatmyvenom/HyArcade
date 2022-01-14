const task = require("../src/cluster/task");

/**
 * 
 * @returns {*}
 */
async function main () {
  await task.accounts();
}

module.exports = main;