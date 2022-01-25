const cli = require("../../src/cli");

/**
 * 
 * @param {string[]} args 
 * @returns {*}
 */
async function main (args) {
  await cli.addGIDMembers(args);
}

module.exports = main;