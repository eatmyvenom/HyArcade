const {
  logger
} = require("../utils");
const {
  URL
} = require("url");
const process = require("process");
const FileCache = require("../utils/files/FileCache");
const updateAccounts = require("../datagen/updateAccounts");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const utils = require("../utils");
const { rm } = require("fs-extra");
const webhook = require("../events/webhook");
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
  info: require("./Res/info"),
  ping: require("./Res/ping")
};

/**
 * @type {FileCache}
 */
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
 * @param {object[]} accounts 
 * @returns {*}
 */
function indexAccs (accounts) {
  const obj = {};

  for(const acc of accounts) {
    obj[acc.uuid] = acc;
  }

  return obj;
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
      newAccounts = await updateAccounts(oldAccounts, true);
      force = false;
      if(utils.fileExists("force")) {
        await rm("force");
      }
    } else {
      newAccounts = await updateAccounts(oldAccounts, false);
    }

    logger.debug("Merging updated account data");

    const newAccs = AccountArray([...newAccounts, ...Object.values(fileCache.indexedAccounts)]);

    logger.log(`New accounts length is ${newAccs.length}`);
    fileCache.indexedAccounts = indexAccs(newAccs);

    lock = false;
    fileCache.save();
    logger.info("Database updated");
  }
}

module.exports = function start (port) {
  logger.name = "Database";
  fileCache = new FileCache("data/");

  process.on("beforeExit", (code) => {
    logger.log(`Exiting process with code : ${code}`);
  });

  setInterval(() => webhook.sendMW(fileCache), 480000);
  setInterval(autoUpdater, 240000);
  setInterval(() => force = true, 14400000);

  return require("http")
    .createServer(callback)
    .listen(port);


};
