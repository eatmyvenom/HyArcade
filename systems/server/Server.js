const process = require("process");
const { URL } = require("url");
const logger = require("hyarcade-logger");

const MongoConnector = require("hyarcade-requests/MongoConnector");

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
  info: require("./endpoints/info"),
  ping: require("./endpoints/ping"),
  disc: require("./endpoints/disc"),
  guild: require("./endpoints/guild"),
  hacker: require("./endpoints/hacker"),
  banned: require("./endpoints/banned"),
};

/**
 * @type {MongoConnector}
 */
let connector;

/**
 * @param {Request} request
 * @param {Response} response
 */
async function callback(request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.slice(1).toLowerCase();
  const mod = urlModules[endpoint];

  if (mod == undefined) {
    logger.err(`Attempted nonexistent endpoint '${endpoint}'`);
    response.statusCode = 404;
    response.end();
  } else {
    try {
      logger.verbose(`${request.headers["x-real-ip"]} - ${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);
      await mod(request, response, connector);
      logger.verbose("request completed");
    } catch (error) {
      logger.err(`${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);
      logger.err(error.stack);
      response.statusCode = 404;
      response.end();
    }
  }
}

module.exports = async function start(port) {
  logger.name = "API";
  logger.emoji = "⚡";
  connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect();

  process.on("beforeExit", code => {
    if (!process.argv.includes("--test")) {
      logger.log(`Exiting process with code : ${code}`);
    }
  });

  const server = require("http").createServer(callback).listen(port);

  server.on("close", (...args) => logger.log(...args));
  server.on("error", e => {
    logger.err(e.stack);
  });

  process.on("SIGINT", async signal => {
    logger.log(`Exiting process with signal : ${signal}`);

    process.exit(0);
  });
};
