const cli = require("../cli");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  await cli.addGIDsMembers(args);
}

module.exports = main;
