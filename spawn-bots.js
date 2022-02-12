#!/bin/env node
/* eslint-disable no-undef */

const child_process = require("child_process");
const fs = require("fs-extra");
const Logger = require("hyarcade-logger");
const BotExit = require("./src/events/BotExit");
const BotStart = require("./src/events/BotStart");
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
 * @type {child_process.ChildProcess}
 */
let arcade;

/**
 * @type {child_process.ChildProcess}
 */
let mw;

/**
 *
 */
function restartMW() {
  Logger.error("Mini walls bot crashed!");
  mw = child_process.fork("index.js", ["bot", "mw"], {
    silent: false,
  });
  mw.on("exit", restartMW);
}

/**
 *
 */
function restartArcade() {
  Logger.error("Arcade bot crashed!");
  arcade = child_process.fork("index.js", ["bot"], {
    silent: false,
  });
  arcade.on("exit", restartArcade);
}

/**
 *
 */
async function main() {
  Logger.name = "Bot-Manager";
  Logger.emoji = "🤖";
  try {
    Logger.info("Bots starting...");
    const ascii = await fs.readFile("resources/hyarcade.ascii");
    Logger.info(ascii.toString());
    if (args[2] == "test") {
      Logger.info("Starting test arcade bot...");
      arcade = child_process.fork("./systems/discord/ShardManager.js", ["bot", "test"], {
        silent: false,
      });
    } else {
      Logger.info("Starting arcade bot...");
      arcade = child_process.fork("./systems/discord/ShardManager.js", ["bot"], {
        silent: false,
      });
      await sleep(5500);
      Logger.info("Mini walls bot starting...");
      mw = child_process.fork("./systems/discord/ShardManager.js", ["bot", "mw"], {
        silent: false,
      });

      mw.on("spawn", () => {
        Logger.info("Mini walls bot spawned");
      });
      mw.on("exit", restartMW);

      await sleep(5500);
      await BotStart();
    }

    arcade.on("spawn", async () => {
      Logger.info("Arcade bot spawned");
    });
    arcade.on("exit", restartArcade);
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
