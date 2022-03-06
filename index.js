#!/bin/env node
const os = require("os");
const fs = require("fs-extra");
const process = require("process");
const Webhook = require("hyarcade-events/webhook");
const args = process.argv;
const task = require("./systems/cli/task");

const logger = require("hyarcade-logger");

/**
 * Send party games daily embed
 */
async function sendPGDay() {
  await Webhook.sendPGEmbed();
}

/**
 * Send party games weekly embed
 */
async function sendPGWeek() {
  await Webhook.sendPGWEmbed();
}

/**
 * Send party games monthly embed
 */
async function sendPGMonth() {
  await Webhook.sendPGMEmbed();
}

/**
 * Run the discord task
 *
 */
async function discordBot() {
  await task.discord();
}

/**
 * Write the current PID to a tmp file
 */
async function writePID() {
  if (!fs.existsSync(`${os.tmpdir()}/pgapi`)) {
    await fs.mkdir(`${os.tmpdir()}/pgapi`);
  }
  await fs.writeFile(`${os.tmpdir()}/pgapi/${args[2]}.pid`, `${process.pid}`);
}

/**
 * Remove the tmp PID file
 */
async function rmPID() {
  await fs.rm(`${os.tmpdir()}/pgapi/${args[2]}.pid`);
}

/**
 *
 */
function printRuntimeInfo() {
  logger.debug("----- NEW PROCESS STARTED -----");

  let start = new Date();

  logger.debug(`Args are [${args}] - executing`);
  logger.debug("----- Process info -----");
  logger.debug(`START TIME - ${start.toString()}`);
  logger.debug(`PLATFORM - ${process.platform} ${process.arch}`);
  logger.debug(`PID - ${process.pid}\nCWD - ${process.cwd()}`);
  logger.debug(`NODE VERSION - ${process.versions.node}\nV8 VERSION - ${process.versions.v8}`);
  logger.debug("------------------------");
}

/**
 * Main function in a async wrapper to use other async functions
 *
 */
async function main() {
  printRuntimeInfo();
  let killable = true;

  if (!(args[2] == "bot" || args[2] == "serveDB")) {
    logger.verbose("Writing pid file");
    await writePID();
  }
  switch (args[2]) {
    case "discordPG":
      await sendPGDay();
      break;

    case "discordPGW":
      await sendPGWeek();
      break;

    case "discordPGM":
      await sendPGMonth();
      break;

    case "discordHS":
      await Webhook.sendHSEmbed();
      break;

    case "discordHSW":
      await Webhook.sendHSWEmbed();
      break;

    case "discordHSM":
      await Webhook.sendHSMEmbed();
      break;

    case "discordDWK":
      await Webhook.sendDWKillEmbed();
      break;

    case "bot":
      killable = false;
      await discordBot();
      break;

    case "serveDB": {
      const Server = require("./systems/api/Server");
      logger.out("Starting server for database and listening on port 6000");
      await Server(6000);
      killable = false;
      break;
    }

    default: {
      const runCli = require("./systems/cli");
      await runCli();
    }
  }

  if (!(args[2] == "bot" || args[2] == "serveDB")) {
    await rmPID();
  }

  if (killable) {
    process.nextTick(() => {
      process.exit(0);
    });
  }
}

main()
  .then((...args) => logger.log(...args))
  .catch(error => logger.err(error.stack));
