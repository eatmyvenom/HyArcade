const webhook = require("hyarcade-events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendFakeMiwLB();
}

module.exports = main;
