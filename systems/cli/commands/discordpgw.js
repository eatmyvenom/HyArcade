const webhook = require("@hyarcade/events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendPGWEmbed();
}

module.exports = main;
