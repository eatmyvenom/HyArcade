const webhook = require("../../src/events/webhook");

/** */
async function main() {
  await webhook.sendTOKillEmbed();
}

module.exports = main;
