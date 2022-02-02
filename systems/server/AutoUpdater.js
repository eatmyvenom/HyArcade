const fs = require("fs-extra");
const Logger = require("hyarcade-logger");
const MergeDatabase = require("hyarcade-utils/Database/MergeDatabase");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const updateAccounts = require("../datagen/updateAccounts");

let lock = false;

/**
 * @param {FileCache} fileCache
 */
async function autoUpdater(fileCache) {
  if (!lock && fileCache.ready) {
    lock = true;
    Logger.info("Updating database");
    const oldAccounts = fileCache.accounts;

    let newAccounts;
    if (fs.existsSync("force")) {
      Logger.debug("Forcing full update");
      try {
        newAccounts = await updateAccounts(oldAccounts, true, true);
      } catch (error) {
        Logger.err(error);
        lock = false;
        return;
      }

      if (fs.existsSync("force")) {
        await fs.rm("force");
      }
    } else {
      try {
        newAccounts = await updateAccounts(oldAccounts, false);
      } catch (error) {
        Logger.err(error);
        lock = false;
        return;
      }
    }

    Logger.debug("Merging updated account data");

    try {
      fileCache.indexedAccounts = await MergeDatabase(newAccounts, Object.values(fileCache.indexedAccounts), fileCache);
    } catch (error) {
      Logger.err(error);
      lock = false;
      return;
    }

    lock = false;
    fileCache.save();
    Logger.log("Database updated");
  }
}

module.exports = autoUpdater;
