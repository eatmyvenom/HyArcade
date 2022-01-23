const Logger = require("hyarcade-logger");
const MergeDatabase = require("hyarcade-utils/Database/MergeDatabase");
const updateAccounts = require("../datagen/updateAccounts");
const fs = require("fs-extra");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");

let lock = false;

/**
 * @param {FileCache} fileCache
 */
async function autoUpdater (fileCache) {
  if(!lock) {
    lock = true;
    Logger.info("Updating database");
    const oldAccounts = fileCache.accounts;

    let newAccounts;
    if(fs.existsSync("force")) {
      Logger.debug("Forcing full update");
      try {
        newAccounts = await updateAccounts(oldAccounts, true, true);
      } catch (e) {
        Logger.err(e.stack);
        lock = false;
        return;
      }

      if(fs.existsSync("force")) {
        await fs.rm("force");
      }
    } else {
      try {
        newAccounts = await updateAccounts(oldAccounts, false);
      } catch (e) {
        Logger.err(e.stack);
        lock = false;
        return;
      }
    }

    Logger.debug("Merging updated account data");

    try {
      fileCache.indexedAccounts = await MergeDatabase(newAccounts, Object.values(fileCache.indexedAccounts), fileCache);
    } catch (e) {
      Logger.err(e.stack);
      lock = false;
      return;
    }

    lock = false;
    fileCache.save();
    Logger.log("Database updated");
  }
}

module.exports = autoUpdater;