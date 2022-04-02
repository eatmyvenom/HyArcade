const Database = require("@hyarcade/requests/Database");

/**
 *
 * @param {string[]} args
 */
async function main(args) {
  await Database.internal({ forceUpdate: args[3] });
}

module.exports = main;
