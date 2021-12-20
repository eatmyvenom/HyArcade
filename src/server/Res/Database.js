const Logger = require("hyarcade-logger");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const FileCache = require("../../utils/files/FileCache");
const cfg = require("../../Config").fromJSON();
const { Readable, pipeline } = require("stream");
const zlib = require("zlib");

/**
 * 
 * @param {object[]} accounts 
 * @returns {*}
 */
function indexAccs (accounts) {
  const obj = {};

  for(const acc of accounts) {
    obj[acc.uuid] = acc;
  }

  return obj;
}

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

    const fields = url.searchParams.get("fields");
    const file = url.searchParams.get("path");
    
    const largeReq = false;
    if(largeReq && req.headers.authorization != cfg.dbPass) {
      res.statusCode = 403;
      res.end();
    } else {

      let data;
      if(file != "accounts") {
        data = fileCache[file];
      } else {
        data = Object.values(fileCache.indexedAccounts);
      }

      let acceptEncoding = req.headers["accept-encoding"];
      if (!acceptEncoding) {
        acceptEncoding = "";
      }
      
      if(data == undefined) {
        res.statusCode = 404;
        res.end();
      }

      const cb = () => {};
      const s = new Readable();

      s._read = () => {};

      if(fields == null) {
        s.push(JSON.stringify(data));
      } else {
        s.push(JSON.stringify(data, fields.split(",")));
      }
      s.push(null);

      if (/\bdeflate\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "deflate" });
        pipeline(s, zlib.createDeflate(), res, cb);
      } else if (/\bgzip\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "gzip" });
        pipeline(s, zlib.createGzip(), res, cb);
      } else if (/\bbr\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "br" });
        pipeline(s, zlib.createBrotliCompress(), res, cb);
      } else {
        res.writeHead(200, {});
        pipeline(s, res, cb);
      }
    }
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

          json = undefined;

          Logger.log(`New accounts length is ${newAccs.length}`);
          fileCache.indexedAccounts = indexAccs(newAccs);

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
