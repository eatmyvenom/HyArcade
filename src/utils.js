const Config = require("./Config");
const cfg = Config.fromJSON();
const fs = require("fs-extra");
const BSONwriter = require("./utils/files/BSONwriter");
const {
  default: fetch
} = require("node-fetch");
const logger = require("hyarcade-logger");

/**
 * Halt execution for a specified amount of time
 *
 * @param {number} time the time in milliseconds to sleep
 * @returns {Promise<setTimeout>} the promise object
 */
function sleep (time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Determine which element has the most wins
 *
 * @param {*} element1 the first element to be considered
 * @param {*} element2 the second element to be considered
 * @returns {number} where the first element should move in relation to its current position
 */
function winsSorter (element1, element2) {
  if(cfg.sortDirection == "mostleast") {
    if(element1.wins < element2.wins) return 1;
    if(element1.wins > element2.wins) return -1;
    return 0;
  }
  if(element1.wins > element2.wins) return 1;
  if(element1.wins < element2.wins) return -1;
  return 0;

}

/**
 * The time in the day that it is currently
 *
 * @returns {string} The formatted time
 */
function daytime () {
  return cfg.showDaytime ?
    `${Date()
      .replace(/.*20[0-9][0-9] /, "")
      .replace(/ [A-Z]..-[0-9]... \(.*\)/, "")} ` :
    "";
}

/**
 * The current day
 *
 * @returns {string} The formatted day
 */
function day () {
  return Date()
    .replace(/[0-9].:[0-9].:[0-9].*/, "")
    .trim()
    .replace(/ /g, "_");
}

/**
 * Write json data to a file
 *
 * @param {string} path path of the target file
 * @param {object} json the json data
 */
async function writeJSON (path, json) {
  // await BSONwriter(path, json);
  await fs.writeFile(`data/${path}`, JSON.stringify(json, null, 4));
  try {
    await readJSON(path);
  } catch (e) {
    await writeJSON(path, json);
  }
}

/**
 * @param {string} path
 * @param {object} json
 */
async function writeDB (path, json) {
  const data = JSON.stringify(json);
  const url = new URL("db", cfg.dbUrl);
  url.searchParams.set("path", path);
  logger.debug(`Writing to ${path} in database`);

  try {
    await fetch(url.toString(), {
      method: "post",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: cfg.dbPass
      }
    });
  } catch (e) {
    logger.err("Can't connect to database");
    logger.err(e);
  }
}

/**
 * @param {string} file
 * @returns {object} Object of whatever was returned by the database
 */
async function readDB (file) {
  let fileData;
  const url = new URL("db", cfg.dbUrl);
  const path = `${file}`;
  url.searchParams.set("path", path);
  logger.debug(`Fetching ${url.searchParams.toString()} from database`);

  try {
    fileData = await (await fetch(url)).json();
  } catch (e) {
    logger.err("Can't connect to database");
    logger.err(e);
    return {};
  }
  logger.debug("Data fetched!");
  return fileData;
}

/**
 * @param {string} path
 * @returns {object} Parsed json
 */
async function readJSON (path) {
  return JSON.parse(await fs.readFile(`data/${path}`));
}

/**
 * Check if a file exists
 *
 * @param {string} path path of the target file
 * @returns {boolean} If the file exists
 */
function fileExists (path) {
  return require("fs").existsSync(path);
}

/**
 * Copy a json file to another location with a timestamp or type
 *
 * @param {string} oldfile path of the source file
 * @param {string} path path of the target file
 * @param {string} timetype the way of specifying this file
 */
async function archiveJson (oldfile, path, timetype) {
  const old = JSON.parse(await fs.readFile(`data/${oldfile}.json`));
  await writeJSON(`${path}${oldfile}.${timetype}.json`, old);

  if(fs.existsSync(`data/${oldfile}.bson`)) {
    await fs.copy(`data/${oldfile}.bson`, `${path}${oldfile}.${timetype}.bson`);
  }

  if(fs.existsSync(`data/${oldfile}.bson.1`)) {
    await fs.copy(`data/${oldfile}.bson.1`, `data/${path}${oldfile}.${timetype}.bson.1`);
    await fs.copy(`data/${oldfile}.bson.2`, `data/${path}${oldfile}.${timetype}.bson.2`);
  }
}


/**
 * @param {object} object
 * @param {string} value
 * @returns {any} The value in the object 
 */
function getKeyByValue (object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const defaultAllowed = Config.fromJSON().discord.trustedUsers;

module.exports = {
  archiveJson,
  day,
  sleep,
  winsSorter,
  writeJSON,
  readJSON,
  writeDB,
  readDB,
  fileExists,
  daytime,
  defaultAllowed,
  getKeyByValue,
  cacheMiss: [],
  logger,
};
