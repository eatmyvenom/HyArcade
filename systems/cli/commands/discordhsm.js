const webhook = require("@hyarcade/events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendHSMEmbed();
}

module.exports = main;
