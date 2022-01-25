#!/bin/env node
const os = require("os");
const fs = require("fs-extra");
const process = require("process");
const Webhook = require("./src/events/webhook");
const {
  listNormal,
  listDiff,
  stringNormal,
  stringDaily
} = require("./src/listUtils");
const args = process.argv;
const task = require("./src/cluster/task");

const logger = require("hyarcade-logger");
const Runtime = require("hyarcade-config/Runtime").fromJSON();

/**
 * Send a list to a discord webhook as formatted text
 * 
 * @param {string} [type="players"] the type of list to log
 * @param {number} [maxamnt=undefined] the maximum index to reach in the list
 */
async function webhookLog (type = "players", maxamnt) {
  await Webhook.send(`\`\`\`\n${await stringNormal(type, maxamnt)}\n\`\`\``);
  await Webhook.send(`\`\`\`\n${await stringDaily(type, maxamnt)}\n\`\`\``);
}

/**
 * Send a list to a discord webhook as a set of formatted embeds
 *
 * @param {string} [type="players"] the type of list to use
 * @param {number} [maxamnt=undefined] the maximum index to reach in the list
 * @see webhookLog
 */
async function webhookEmbed (type = "accounts", maxamnt) {
  const normal = await listNormal(type, maxamnt);
  const day = await listDiff(type, "day", maxamnt);

  await Webhook.sendEmbed("WINS", normal);
  await Webhook.sendEmbed("", day);
}

/**
 * Send party games daily embed
 */
async function sendPGDay () {
  await Webhook.sendPGEmbed();
}

/**
 * Send party games weekly embed
 */
async function sendPGWeek () {
  await Webhook.sendPGWEmbed();
}

/**
 * Send party games monthly embed
 */
async function sendPGMonth () {
  await Webhook.sendPGMEmbed();
}

/**
 * Run the discord task
 *
 */
async function discordBot () {
  await task.discord();
}

/**
 * Write the current PID to a tmp file
 */
async function writePID () {
  if(!fs.existsSync(`${os.tmpdir()}/pgapi`)) {
    await fs.mkdir(`${os.tmpdir()}/pgapi`);
  }
  await fs.writeFile(`${os.tmpdir()}/pgapi/${args[2]}.pid`, `${process.pid}`);
}

/**
 * Remove the tmp PID file
 */
async function rmPID () {
  await fs.rm(`${os.tmpdir()}/pgapi/${args[2]}.pid`);
}

/**
 * Main function in a async wrapper to use other async functions
 *
 */
async function main () {
  let killable = true;

  if(Runtime.apiDown) {
    if(!(args[2] == "bot" || args[2] == "checkStatus" || args[2] == "serveDB")) {
      logger.err("Refusing to run while api is down");
      process.exit(1);
    }
  }

  if(!(args[2] == "bot" || args[2] == "serveDB")) {
    logger.verbose("Writing pid file");
    await writePID();
  }

  logger.debug(`Args are [${args}] - executing`);
  switch(args[2]) {
  case "discord":
    await webhookLog(args[3], args[4]);
    break;
  case "discordE":
    await webhookEmbed(args[3], args[4]);
    break;

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
    const Server = require("./systems/server/Server");
    logger.out("Starting server for database and listening on port 6000");
    await Server(6000);
    killable = false;
    break;
  }

  default: {
    const mod = require(`./systems/cli/${args[2]}`);
    await mod(args);
  }
  }

  if(!(args[2] == "bot" || args[2] == "serveDB")) {
    await rmPID();
  }

  if(killable) {
    process.exit(0);
  }
}

main()
  .then(logger.log)
  .catch((e) => logger.err(e.stack));
