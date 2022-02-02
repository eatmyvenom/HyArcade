const { URL } = require("url");
const cfg = require("hyarcade-config").fromJSON();
const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const Json = require("hyarcade-utils/FileHandling/Json");
const AccountResolver = require("../AccountResolver");
let fakeFile;

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {
  if (fakeFile == undefined) {
    fakeFile = await Json.read("fakeStats.json");
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");
    let resolvedAccount = await AccountResolver(fileCache, url);

    if (resolvedAccount?.name == "INVALID-NAME" || resolvedAccount?.name == undefined || resolvedAccount == undefined) {
      Logger.warn(`${url.searchParams} could not resolve to anything`);
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          error: "ACC_UNDEFINED",
        }),
      );
      return;
    }

    if (resolvedAccount.updateTime < Date.now() - 600000) {
      Logger.verbose(`Updating data for ${resolvedAccount.name}`);
      const newAccount = new Account(resolvedAccount.name, 0, resolvedAccount.uuid);
      Object.assign(newAccount, resolvedAccount);

      await newAccount.updateHypixel();

      if (Object.keys(fakeFile).includes(newAccount.uuid)) {
        Logger.log(`Overwriting data for ${newAccount.name}`);
        Object.assign(newAccount, fakeFile[newAccount.uuid]);
      }

      resolvedAccount = newAccount;
      fileCache.indexedAccounts[resolvedAccount.uuid] = resolvedAccount;
    }

    const time = url.searchParams.get("time");
    let response = {};

    if (time != null && time != "lifetime") {
      response.acc = resolvedAccount;
      const snapshotAccount = fileCache[`indexed${time}`][resolvedAccount.uuid];
      response.timed = snapshotAccount;
    } else {
      response = resolvedAccount;
    }

    res.write(JSON.stringify(response));
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};
    if (req.headers.authorization == cfg.dbPass) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        json = JSON.parse(data);

        const newAcc = Account.from(json);
        fileCache.indexedAccounts[json.uuid] = newAcc;
        fileCache.save();
        res.end();
      });
    } else {
      Logger.warn("Someone tried to post without correct AUTH");
      res.statusCode = 403;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};
