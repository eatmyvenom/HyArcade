const AccountEvent = require("hyarcade-structures/Event");

/**
 * @param {string[]} args
 */
async function main (args) {
  const event = new AccountEvent(args[3], args[4], args[5], args[6], args[7], args[8]);
  await event.toDiscord();
}

module.exports = main;
