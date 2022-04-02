const webhook = require("@hyarcade/events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendHSWEmbed();
}

module.exports = main;
