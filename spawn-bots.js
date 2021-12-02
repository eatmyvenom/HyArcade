#!/bin/env node

const child_process = require("child_process");
const Logger = require("hyarcade-logger");
const fs = require("fs-extra");
// eslint-disable-next-line no-undef
const args = process.argv;

/**
 * @param {number} time
 * @returns {Promise}
 */
function sleep (time) {
  return new Promise((resolve) => {
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
async function main () {
  try {
    Logger.info("Bots starting...");
    const ascii = (await fs.readFile("resources/hyarcade.ascii")).toString();
    Logger.info(ascii);
    if(args[2] == "test") {
      Logger.info("Starting test arcade bot...");
      arcade = child_process.fork("./src/discord/ShardManager.js", ["bot", "test"], {
        silent: false
      });
    } else {
      Logger.info("Starting arcade bot...");
      arcade = child_process.fork("./src/discord/ShardManager.js", ["bot"], {
        silent: false
      });
      await sleep(5500);
      Logger.info("Mini walls bot starting...");
      mw = child_process.fork("./src/discord/ShardManager.js", ["bot", "mw"], {
        silent: false
      });

      mw.on("spawn", () => {
        Logger.info("Mini walls bot spawned");
      });
      mw.on("exit", restartMW);
    }

    arcade.on("spawn", () => {
      Logger.info("Arcade bot spawned");
    });
    arcade.on("exit", restartArcade);
  } catch (e) {
    Logger.err(e.stack);
  }
}

/**
 *
 */
function restartMW () {
  Logger.error("Mini walls bot crashed!");
  mw = child_process.fork("index.js", ["bot", "mw"], {
    silent: false
  });
  mw.on("exit", restartMW);
}

/**
 *
 */
function restartArcade () {
  Logger.error("Arcade bot crashed!");
  arcade = child_process.fork("index.js", ["bot"], {
    silent: false
  });
  arcade.on("exit", restartArcade);
}

main();
