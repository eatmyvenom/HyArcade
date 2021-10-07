const {
  URL
} = require("url");
const cfg = require("../../Config").fromJSON();
const Logger = require("hyarcade-logger");
const FileCache = require("../../utils/files/FileCache");
const Account = require("hyarcade-requests/types/Account");
const utils = require("../../utils");
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
    }

    res.write(JSON.stringify(acc));
    res.end();
  } else if(req.method == "POST") {
    let data = "";
    let json = {};
    if(req.headers.authorization == cfg.dbPass) {
      req.on("data", (d) => data += d);
      req.on("end", async () => {
        json = JSON.parse(data);
        const prevAcc = fileCache.accounts.indexOf(fileCache.accounts.find((a) => a.uuid == json.uuid));
        if(prevAcc != -1) {
          const newAcc = Account.from(json);
          fileCache.accounts[prevAcc] = newAcc;
        } else {
          fileCache.accounts.push(json);
        }
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
