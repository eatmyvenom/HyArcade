const webhook = require("../../events/webhook");

/** */
async function main() {
  await webhook.sendTOKillEmbed();
}

module.exports = main;
