#!/bin/env node

if(!require("fs").existsSync("./config.json")) {
  require("fs").writeFileSync("./config.json", "{}");
}

const os = require("os");
const fs = require("fs/promises");
const process = require("process");
const gameAmount = require("./src/gameAmount");
const Webhook = require("./src/events/webhook");
const utils = require("./src/utils");
const cli = require("./src/cli");
const {
  listNormal,
  listDiff,
  stringNormal,
  stringDaily
} = require("./src/listUtils");
const args = process.argv;
const cluster = require("./src/cluster/cluster");
const task = require("./src/cluster/task");

const Cfg = require("./src/Config");
const config = Cfg.fromJSON();
const AccountEvent = require("./src/classes/Event");
const dataGeneration = require("./src/dataGeneration");
const Server = require("./src/server/Wrap");
const Translator = require("./src/mongo/Translator");
const logger = require("hyarcade-logger");
const BSONreader = require("./src/utils/files/BSONreader");
const Runtime = require("./src/Runtime").fromJSON();

/**
 * Run the accounts task
 *
 */
async function updateAllAccounts () {
  await task.accounts();
}

/**
 * Run the players task
 *
 */
async function updateAllPlayers () {
  await task.players();
}

/**
 * Run the guilds task
 *
 */
async function updateAllGuilds () {
  await task.guilds();
}

/**
 * Run all three of the stats tasks
 * 
 * @see save
 * @see updateAllAccounts
 * @see updateAllPlayers
 * @see updateAllGuilds
 */
async function updateAll () {
  await updateAllAccounts();
  await updateAllPlayers();
  await updateAllGuilds();
}

/**
 * Wrapper around updateAll()
 * 
 * @see updateAll
 */
async function save () {
  // this was all abstracted
  await updateAll();
}
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
 * Send throw out kills embed
 */
async function sendToKill () {
  await Webhook.sendTOKillEmbed();
}

/**
 * Snapshot the amount of wins into another json file
 * 
 * @param {string} timeType the inbetween of the file
 */
async function snap (timeType = "day") {
  // move all the current stats files to be the daily files
  await archive("./", timeType);
}

/**
 * Run the status task
 *
 */
async function genStatus () {
  await task.status();
}

/**
 * Run the discord task
 *
 */
async function discordBot () {
  await task.discord();
}

/**
 * Write a file with all the amounts of players currrently in games
 *
 */
async function gameAmnt () {
  // write to file so that there isnt blank files in website at any point
  await fs.writeFile("games.txt", await gameAmount.formatCounts());
}

/**
 * Archive the various json files storing current data for later
 *
 * @param {string} [path="./archive/"] the path to place the archived files at
 * @param {string} [timetype=utils.day()] the varied part of the file to distinguish it
 */
async function archive (path = "./archive/", timetype = utils.day()) {
  await Promise.all([
    utils.archiveJson("guild", path, timetype),
    utils.archiveJson("players", path, timetype),
    utils.archiveJson("accounts", path, timetype),
  ]);
}

/**
 * Write a logger output as a file
 *
 * @param {string[]} args the process arguments
 */
async function writeFile (args) {
  const logName = args[3];
  const location = args[4];
  const str = await stringNormal(logName);

  await fs.writeFile(location, str);
}

/**
 * Write a daily wins logger output as a file
 *
 * @param {string[]} args the process arguments
 */
async function writeFileD (args) {
  const logName = args[3];
  const location = args[4];
  const str = await stringDaily(logName);

  await fs.writeFile(location, str);
}

/**
 * wrapper function to do all cluster tasks
 */
async function clusterHandler () {
  const cstr = new cluster(config.cluster);
  await cstr.doTasks();
  await cstr.uploadData();
}

/**
 * Run the games played task
 *
 */
async function gamesPlayed () {
  await task.gamesPlayed();
}

/**
 * Run status text sorted tast
 */
async function statusSort () {
  await task.statusTxtSorted();
}

/**
 * Run task to add players from coin leaderboards
 */
async function addLeaderboards () {
  await task.addLeaderboards();
}

/**
 * Write the current PID to a tmp file
 */
async function writePID () {
  if(!utils.fileExists(`${os.tmpdir()}/pgapi`)) {
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
 * Send a custom discord event based on process args
 */
async function sendDiscordEvent () {
  const event = new AccountEvent(args[3], args[4], args[5], args[6], args[7], args[8]);
  await event.toDiscord();
}

/**
 * Minify config file
 */
async function miniconfig () {
  const conf = Cfg.fromJSON();
  await fs.writeFile("./config.min.json", JSON.stringify(conf));
}

/**
 * Log everyones game counts
 */
async function logGames () {
  const games = await BSONreader("gameCounts.bson");
  console.log(JSON.stringify(games, null, 4));
}

/**
 * Main function in a async wrapper to use other async functions
 *
 */
async function main () {
  // let database = await Connection();
  // let db = database.db("hyarcade");
  if(Runtime.apiDown) {
    if(!(args[2] == "bot" || args[2] == "checkStatus" || args[2] == "serveDB")) {
      logger.err("Refusing to run while api is down");
      process.exit(1);
    }
  }

  if(!(args[2] == "bot" || args[2] == "serveDB")) {
    await writePID();
  }

  // use different functions for different args
  // switch has one x86 instruction vs multiple for if statements
  logger.debug(`Args are [${args}] - executing`);
  switch(args[2]) {
  case "logG":
    await cli.logNormal("guild");
    break;
  case "logA":
    await cli.logNormal("accounts");
    break;
  case "logP":
    await cli.logNormal("players");
    break;

  case "logGD":
    await cli.logDaily("guild");
    break;
  case "logAD":
    await cli.logDaily("accounts");
    break;
  case "logPD":
    await cli.logDaily("players");
    break;

  case "log":
    await cli.log(args);
    break;
  case "logD":
    await cli.logD(args);
    break;

  case "write":
    await writeFile(args);
    break;
  case "writeD":
    await writeFileD(args);
    break;

  case "save":
    await save();
    break;
  case "snap":
    await snap(args[3]);
    break;
  case "archive":
    await archive();
    break;

  case "status":
    await genStatus();
    break;

  case "statusSort":
    await statusSort();
    break;

  case "gamesPlayed":
    await gamesPlayed();
    break;

  case "logGames":
    await logGames();
    break;

  case "games":
    await gameAmnt();
    break;

  case "cluster":
    await clusterHandler();
    break;

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

  case "discordTOK":
    await sendToKill();
    break;

  case "discordMW":
    await Webhook.sendMW(args[3]);
    break;

  case "link":
  case "ln":
    await cli.linkDiscord();
    break;

  case "lbs":
  case "addLb":
  case "addLeaderboards":
    await addLeaderboards();
    break;

  case "names":
    await cli.checkNames();
    break;

  case "newAcc":
    await cli.newAcc();
    break;
  case "newPlr":
    await cli.newPlayer();
    break;
  case "newGuild":
    await cli.newGuild();
    break;

  case "moveAcc":
    await cli.moveAcc();
    break;

  case "getUUID":
    await cli.getUUID(args);
    break;

  case "addGuildMembers":
  case "gmembers":
  case "addGM":
    await cli.addGuildMembers(args);
    break;

  case "addGID":
    await cli.addGIDMembers(args);
    break;

  case "bot":
    await discordBot();
    break;

  case "sendDiscordEvent":
  case "discordEvent":
  case "discEvt":
    await sendDiscordEvent();
    break;

  case "minify":
    await miniconfig();
    break;

  case "boosters":
    await dataGeneration.saveBoosters();
    break;

  case "translateDb":
    await Translator();
    break;

  case "checkStatus": {
    console.log(await cli.getServerStatus());
    break;
  }

  case "serveDB": {
    logger.out("Starting server for database and listening on port 6000");
    Server(6000);
    break;
  }
  }

  if(!(args[2] == "bot" || args[2] == "serveDB")) {
    await rmPID();
  }
}

main();
