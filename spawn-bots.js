#!/bin/env node
/* eslint-disable no-undef */

const child_process = require("child_process");
const fs = require("fs-extra");
const Logger = require("@hyarcade/logger");
const GetAsset = require("@hyarcade/utils/FileHandling/GetAsset");
const BotExit = require("@hyarcade/events/BotExit");
const BotStart = require("@hyarcade/events/BotStart");
// eslint-disable-next-line no-undef
const args = process.argv;

/**
 * @param {number} time
 * @returns {Promise}
 */
function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

/**
 *
 */
async function main() {
  Logger.name = "Bot-Manager";
  Logger.emoji = "🤖";
  try {
    Logger.info("Bots starting...");
    const ascii = await fs.readFile(GetAsset("hyarcade.ascii"));
    Logger.info(ascii.toString());
    if (args[2] == "test") {
      arcade = child_process.fork("./systems/discord/ShardManager.js", ["bot", "test"], {
        silent: false,
      });
    } else {
      arcade = child_process.fork("./systems/discord/ShardManager.js", ["bot"], {
        silent: false,
      });
      await sleep(5500);
      mw = child_process.fork("./systems/discord/ShardManager.js", ["bot", "mw"], {
        silent: false,
      });

      await sleep(5500);
      await BotStart();
    }
  } catch (error) {
    Logger.err(error.stack);
  }

  process.on("SIGINT", async signal => {
    mw.removeAllListeners();
    arcade.removeAllListeners();

    await BotExit();

    arcade.kill();
    mw.kill();

    Logger.log(`Exiting process with signal : ${signal}`);

    process.exit(0);
  });
}

main();
