const {
  logger
} = require("../utils");
const {
  URL
} = require("url");
const process = require("process");
const FileCache = require("../utils/files/FileCache");
const urlModules = {
  account: require("./Res/account"),
  acc: require("./Res/account"),
  leaderboard: require("./Res/leaderboard"),
  lb: require("./Res/leaderboard"),
  db: require("./Res/Database"),
  mwlb: require("./Res/MiniWallsLeaderboard"),
  miniwalls: require("./Res/MiniWallsLeaderboard"),
  timeacc: require("./Res/TimeAcc"),
  acctimed: require("./Res/TimeAcc"),
  resolve: require("./Res/NameSearch"),
  namesearch: require("./Res/NameSearch"),
  info: require("./Res/info")
};
let fileCache;

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

module.exports = function start (port) {
  fileCache = new FileCache("data/");

  process.on("beforeExit", (code) => {
    logger.log(`Exiting process with code : ${code}`);
  });

  return require("http")
    .createServer(callback)
    .listen(port);

};
