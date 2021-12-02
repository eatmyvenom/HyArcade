const Logger = require("hyarcade-logger");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const FileCache = require("../../utils/files/FileCache");
const cfg = require("../../Config").fromJSON();

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const file = url.searchParams.get("path");
    const data = fileCache[file];

    if(data == undefined) {
      res.statusCode = 404;
      res.end();
    }

    if(Array.isArray(data)) {
      res.write("[");
      for(const item of data) {
        res.write(`${JSON.stringify(item)},`);
      }
      res.write("]");
    }

    res.end();
  } else if(req.method == "POST") {
    let data = "";
    let json = {};
    if(req.headers.authorization == cfg.dbPass) {
      req.on("data", (d) => data += d);
      req.on("end", async () => {
        try {
          json = JSON.parse(data);
        } catch (e) {
          Logger.err("JSON parsing of new database data failed");
          Logger.err(e.stack);
          Logger.debug(data);
          res.end();
        }


        if(url.searchParams.get("path") == "accounts") {
          Logger.log("Saving new accounts");
          const old = fileCache[url.searchParams.get("path")];
          const newAccs = AccountArray([...json, ...old]);

          Logger.log(`New accounts length is ${newAccs.length}`);
          fileCache.accounts = AccountArray(newAccs);

        } else {
          fileCache[url.searchParams.get("path")] = json;
        }

        await fileCache.save();
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
