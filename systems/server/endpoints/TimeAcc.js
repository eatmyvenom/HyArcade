const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const {
  URL
} = require("url");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const AccountResolver = require("../AccountResolver");
const Json = require("hyarcade-utils/FileHandling/Json");
let fakeFile;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {

  if(fakeFile == undefined) {
    fakeFile = await Json.read("fakeStats.json");
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");
    let resolvedAccount = await AccountResolver(fileCache, url);

    if(resolvedAccount?.name == "INVALID-NAME" || resolvedAccount?.name == undefined || resolvedAccount == undefined) {
      Logger.warn(`${url.searchParams} could not resolve to anything`);
      res.statusCode = 404;
      res.end(JSON.stringify({
        error: "ACC_UNDEFINED"
      }));
      return;
    }

    if(resolvedAccount.updateTime < (Date.now() - 600000)) {
      Logger.debug(`Updating data for ${resolvedAccount.name}`);
      const newAccount = new Account(resolvedAccount.name, 0, resolvedAccount.uuid);
      Object.assign(newAccount, resolvedAccount);

      await newAccount.updateHypixel();

      if(Object.keys(fakeFile).includes(newAccount.uuid)) {
        Logger.log(`Overwriting data for ${newAccount.name}`);
        Object.assign(newAccount, fakeFile[newAccount.uuid]);
      }

      resolvedAccount = newAccount;
      fileCache.indexedAccounts[resolvedAccount.uuid] = resolvedAccount;
    }

    const time = url.searchParams.get("time");
    let response = {};

    if(time != null && time != "lifetime") {
      response.acc = resolvedAccount;
      const snapshotAccount = fileCache[`indexed${time}`][resolvedAccount.uuid];
      response.timed = snapshotAccount;
    } else {
      response = resolvedAccount;
    }

    res.write(JSON.stringify(response));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
