const AddFriends = require("../../src/datagen/AddFriends");

/**
 * 
 * @param {string[]} args 
 * @returns {*}
 */
async function main (args) {
  await AddFriends(args[3]);
}

module.exports = main;