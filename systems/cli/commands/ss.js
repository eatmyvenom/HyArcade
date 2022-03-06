const Logger = require("hyarcade-logger");
const webhook = require("hyarcade-events/webhook");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  Logger.name = "Screenshotter";
  switch (args[3]) {
    case "week": {
      return await webhook.sendFakeWeekLBs();
    }

    case "month": {
      return await webhook.sendFakeMonthLBs();
    }

    default: {
      return await webhook.sendFakeLifetimeLBs();
    }
  }
}

module.exports = main;
