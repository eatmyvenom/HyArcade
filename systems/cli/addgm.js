const cli = require("../../src/cli");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  await cli.addGuildMembers(args);
}

module.exports = main;
