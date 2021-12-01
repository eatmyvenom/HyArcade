const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const {
  URL
} = require("url");
const utils = require("../../utils");
const FileCache = require("../../utils/files/FileCache");
const AccountResolver = require("../AccountResolver");
let fakeFile;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {

  if(fakeFile == undefined) {
    fakeFile = await utils.readJSON("fakeStats.json");
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");
    let acc = await AccountResolver(fileCache, url);

    if(acc?.name == "INVALID-NAME" || acc?.name == undefined || acc == undefined) {
      Logger.warn(`${url.searchParams} could not resolve to anything`);
      res.statusCode = 404;
      res.end(JSON.stringify({
        error: "ACC_UNDEFINED"
      }));
      return;
    }

    if(acc.updateTime < (Date.now() - 600000)) {
      Logger.debug(`Updating data for ${acc.name}`);
      const nacc = new Account(acc.name, 0, acc.uuid);
      Object.assign(nacc, acc);

      await nacc.updateHypixel();

      if(Object.keys(fakeFile).includes(nacc.uuid)) {
        Logger.log(`Overwriting data for ${nacc.name}`);
        Object.assign(nacc, fakeFile[nacc.uuid]);
      }

      acc = nacc;
      fileCache.accounts[acc.uuid] = acc;
    }

    const time = url.searchParams.get("time");
    const response = {};

    if(time != null) {
      response.acc = acc;
      const timedAcc = fileCache[`indexed${time}`][acc.uuid];
      response.timed = timedAcc;
    }

    res.write(JSON.stringify(response));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
