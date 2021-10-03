const {
  URL
} = require("url");
const cfg = require("../../Config").fromJSON();
const Logger = require("hyarcade-logger");
const FileCache = require("../../utils/files/FileCache");
const Account = require("hyarcade-requests/types/Account");
const { default: fetch } = require("node-fetch");
const utils = require("../../utils");
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
    const ign = url.searchParams.get("ign");
    let uuid = url.searchParams.get("uuid");
    const discid = url.searchParams.get("discid");
    res.setHeader("Content-Type", "application/json");
    const {
      accounts
    } = fileCache;
    let acc;

    if(ign != null) {
      acc = accounts.find((a) => a.name?.toLowerCase() == ign?.toLowerCase());
    } else if(uuid != null) {
      acc = accounts.find((a) => a.uuid?.toLowerCase() == uuid?.toLowerCase());
    } else if(discid != null) {
      acc = accounts.find((a) => a.discord == discid);
    }

    if(acc == undefined && ign != null) {
      acc = accounts.find((a) => {
        if(a.nameHist && a.nameHist.length > 0) {
          for(const name of a.nameHist) {
            if(name.toLowerCase().startsWith(ign)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    if(acc == undefined) {
      if(uuid == null) {
        let elecreq = await fetch(`https://api.ashcon.app/mojang/v2/user/${ign}`);
        elecreq = await elecreq.json();
        if(elecreq != undefined) {
          uuid = elecreq.uuid.replace(/-/g, "");
        } 
      }

      if (uuid != null) {
        acc = new Account(ign, 0, uuid);
        await acc.updateHypixel();
        fileCache.accounts.push(acc);
      }
    }

    if(acc.name == "INVALID-NAME" && acc.name == undefined && acc != undefined) {
      res.statusCode = 404;
      res.end(JSON.stringify({
        error: "ACC_UNDEFINED"
      }));
      return;
    }

    if(acc.updateTime < (Date.now() - 600000)) {
      Logger.debug(`Updating data for ${acc.name}`);
      const nacc = new Account(ign, 0, uuid);
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
