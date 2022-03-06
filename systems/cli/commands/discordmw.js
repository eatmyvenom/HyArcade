const webhook = require("hyarcade-events/webhook");

/**
 * @param {string[]} args
 */
async function main(args) {
  await webhook.sendMW(args[3]);
}

module.exports = main;
