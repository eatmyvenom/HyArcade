const webhook = require("../../src/events/webhook");

/**
 *
 */
async function main() {
  await webhook.sendFakeMiwLB();
}

module.exports = main;
