const webhook = require("@hyarcade/events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendPGEmbed();
}

module.exports = main;
