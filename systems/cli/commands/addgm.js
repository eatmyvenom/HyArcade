const cli = require("../cli");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  await cli.addGuildMembers(args);
}

module.exports = main;
