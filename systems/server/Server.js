const logger = require("hyarcade-logger");

const { URL } = require("url");
const process = require("process");

const FileCache = require("hyarcade-utils/FileHandling/FileCache");

const webhook = require("../../src/events/webhook");
const StatusExit = require("../../src/events/StatusExit");
const StatusStart = require("../../src/events/StatusStart");
const autoUpdater = require("./AutoUpdater");

const urlModules = {
  account: require("./endpoints/account"),
  acc: require("./endpoints/account"),
  leaderboard: require("./endpoints/leaderboard"),
  lb: require("./endpoints/leaderboard"),
  db: require("./endpoints/Database"),
  database: require("./endpoints/Database"),
  mwlb: require("./endpoints/MiniWallsLeaderboard"),
  miniwalls: require("./endpoints/MiniWallsLeaderboard"),
  timeacc: require("./endpoints/TimeAcc"),
  timeaccount: require("./endpoints/TimeAcc"),
  acctimed: require("./endpoints/TimeAcc"),
  resolve: require("./endpoints/NameSearch"),
  namesearch: require("./endpoints/NameSearch"),
  info: require("./endpoints/info"),
  ping: require("./endpoints/ping")
};

let fileCache;

/**
 * @param {Request} request
 * @param {Response} response
 */
async function callback (request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.slice(1).toLowerCase();
  const mod = urlModules[endpoint];

  if(mod == undefined) {
    logger.err(`Attempted nonexistent endpoint '${endpoint}'`);
    response.statusCode = 404;
    response.end();
  } else {
    if(fileCache.ready == false) {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ ERROR: "Reloading database!" }));
      logger.warn(`${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams}) not available when reloading!`);
      return;
    }

    try {
      logger.info(`${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);
      await mod(request, response, fileCache);
    } catch (e) {
      logger.err(e.stack);
      response.statusCode = 404;
      response.end();
    }
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

  if(!process.argv.includes("--test")) {
    setInterval(() => webhook.sendMW(fileCache), 960000);
    setInterval(() => autoUpdater(fileCache), 60000);
  }

  const server = require("http")
    .createServer(callback)
    .listen(port);

  server.on("close", logger.log);
  server.on("error", (e) => {logger.err(e.stack);});

  process.on("SIGINT", async (signal) => {
    if(!process.argv.includes("--test")) {
      await StatusExit();
      logger.log(`Exiting process with signal : ${signal}`);
    }

    process.exit(0);
  });

};
