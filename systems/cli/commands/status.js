const start = require("hyarcade-events/BotStart");
const stop = require("hyarcade-events/BotExit");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  if (args[3] == "start") {
    return await start();
  } else if (args[3] == "stop") {
    return await stop();
  }
}

module.exports = main;
