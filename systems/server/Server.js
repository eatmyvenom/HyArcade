const logger = require("hyarcade-logger");

const { URL } = require("url");
const { rm } = require("fs-extra");
const process = require("process");

const FileCache = require("../../src/utils/files/FileCache");
const updateAccounts = require("../../src/datagen/updateAccounts");
const utils = require("../../src/utils");
const webhook = require("../../src/events/webhook");
const StatusExit = require("../../src/events/StatusExit");
const StatusStart = require("../../src/events/StatusStart");

const MergeDatabase = require("./MergeDatabase");

const urlModules = {
  account: require("./endpoints/account"),
  acc: require("./endpoints/account"),
  leaderboard: require("./endpoints/leaderboard"),
  lb: require("./endpoints/leaderboard"),
  db: require("./endpoints/Database"),
  mwlb: require("./endpoints/MiniWallsLeaderboard"),
  miniwalls: require("./endpoints/MiniWallsLeaderboard"),
  timeacc: require("./endpoints/TimeAcc"),
  acctimed: require("./endpoints/TimeAcc"),
  resolve: require("./endpoints/NameSearch"),
  namesearch: require("./endpoints/NameSearch"),
  info: require("./endpoints/info"),
  ping: require("./endpoints/ping")
};

let fileCache;
let lock = false;
let force = false;

/**
 * @param {Request} request
 * @param {Response} response
 */
async function callback (request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.slice(1);
  const mod = urlModules[endpoint];
  if(mod == undefined) {
    logger.err(`Attempted nonexistent endpoint '${endpoint}'`);
    response.statusCode = 404;
    response.end();
  } else {

    if(fileCache.ready == false) {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ ERROR: "Reloading database!" }));
      logger.warn(`${url} not available when reloading!`);
      return;
    }

    try {
      logger.info(`${request.method?.toUpperCase()} ${url}`);
      await mod(request, response, fileCache);
    } catch (e) {
      logger.err(e.stack);
      response.statusCode = 404;
      response.end();
    }
  }
}

/**
 * 
 */
async function autoUpdater () {
  if(!lock) {
    lock = true;
    logger.info("Updating database");
    const oldAccounts = fileCache.accounts;

    let newAccounts;
    if(force || utils.fileExists("force")) {
      logger.debug("Forcing full update");
      newAccounts = await updateAccounts(oldAccounts, true, true);
      force = false;
      if(utils.fileExists("force")) {
        await rm("force");
      }
    } else {
      newAccounts = await updateAccounts(oldAccounts, false);
    }

    logger.debug("Merging updated account data");

    fileCache.indexedAccounts = await MergeDatabase(newAccounts, Object.values(fileCache.indexedAccounts), fileCache);

    lock = false;
    fileCache.save();
    logger.log("Database updated");
  }
}

module.exports = async function start (port) {

  if(!process.argv.includes("--test")) {
    StatusStart()
    .then(() => {})
    .catch(logger.err);
  }

  logger.name = "Database";
  fileCache = new FileCache("data/");

  process.on("beforeExit", (code) => {
    if(!process.argv.includes("--test")) {
      logger.log(`Exiting process with code : ${code}`);
    }
  });

  setInterval(() => webhook.sendMW(fileCache), 960000);
  setInterval(autoUpdater, 240000);
  setInterval(() => force = true, 14400000);

  const server = require("http")
    .createServer(callback)
    .listen(port);

  server.on("close", logger.log);
  server.on("error", logger.err);

  process.on("SIGINT", async (signal) => {
    if(!process.argv.includes("--test")) {
      await StatusExit();
      logger.log(`Exiting process with signal : ${signal}`);
    }

    process.exit(0);
  });

};
