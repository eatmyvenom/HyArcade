const webhook = require("hyarcade-events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendPGMEmbed();
}

module.exports = main;
