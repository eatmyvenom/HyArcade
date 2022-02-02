const fs = require("fs-extra");
const Logger = require("hyarcade-logger");

/**
 * Copy a json file to another location with a timestamp or type
 *
 * @param {string} oldfile path of the source file
 * @param {string} path path of the target file
 * @param {string} timetype the way of specifying this file
 */
async function archiveJson(oldfile, path, timetype) {
  Logger.info(`Snapshotting: data/${oldfile}.json -> ${path}${oldfile}.${timetype}.json`);

  await fs.copy(`data/${oldfile}.json`, `data/${path}${oldfile}.${timetype}.json`, { overwrite: true });
  Logger.info(`Snapshot of "data/${oldfile}.json" complete!`);
}

/**
 * Archive the various json files storing current data for later
 *
 * @param {string} [path="./archive/"] the path to place the archived files at
 * @param {string} [timetype] the varied part of the file to distinguish it
 */
async function archive(path = "./archive/", timetype) {
  if (!timetype) {
    // eslint-disable-next-line no-param-reassign
    timetype = Date()
      .replace(/[0-9].:[0-9].:[0-9].*/, "")
      .trim()
      .replace(/ /g, "_");
  }

  await Promise.all([archiveJson("players", path, timetype), archiveJson("accounts", path, timetype)]);
}

/**
 * Snapshot the amount of wins into another json file
 *
 * @param {string} timeType the inbetween of the file
 */
async function snapGuild(timeType = "day") {
  // move all the current stats files to be the daily files
  await archive("./", timeType);
}

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  await snapGuild(args[3]);
}

module.exports = main;
