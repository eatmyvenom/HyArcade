const { pipeline } = require("stream");
const zlib = require("zlib");
const { stringifyStream, parseChunked } = require("@discoveryjs/json-ext");
const cfg = require("hyarcade-config").fromJSON();
const Logger = require("hyarcade-logger");
const MergeDatabase = require("hyarcade-utils/Database/MergeDatabase");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    const fields = url.searchParams.get("fields");
    const file = url.searchParams.get("path");

    const largeReq = false;
    if (largeReq && req.headers.authorization != cfg.dbPass) {
      res.statusCode = 403;
      res.end();
    } else {
      let data;
      data = file != "accounts" ? fileCache[file] : Object.values(fileCache.indexedAccounts);

      let acceptEncoding = req.headers["accept-encoding"];
      if (!acceptEncoding) {
        acceptEncoding = "";
      }

      if (data == undefined) {
        res.statusCode = 404;
        res.end();
      }

      const cb = () => {};
      let stream;

      stream = fields == undefined ? stringifyStream(data) : stringifyStream(data, fields.split(","));

      if (/\bdeflate\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "deflate" });
        pipeline(stream, zlib.createDeflate(), res, cb);
      } else if (/\bgzip\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "gzip" });
        pipeline(stream, zlib.createGzip(), res, cb);
      } else if (/\bbr\b/.test(acceptEncoding)) {
        res.writeHead(200, { "Content-Encoding": "br" });
        pipeline(stream, zlib.createBrotliCompress(), res, cb);
      } else {
        res.writeHead(200, {});
        pipeline(stream, res, cb);
      }
    }
  } else if (req.method == "POST") {
    let json = {};
    if (req.headers.authorization == cfg.dbPass) {
      try {
        json = await parseChunked(req);
      } catch (error) {
        Logger.err("JSON parsing of new database data failed");
        Logger.err(error.stack);
        res.end();
      }

      if (url.searchParams.get("path") == "accounts") {
        Logger.log("Saving new accounts");
        const old = fileCache[url.searchParams.get("path")];

        fileCache.indexedAccounts = await MergeDatabase(json, old);
      } else {
        fileCache[url.searchParams.get("path")] = json;
      }

      await fileCache.save();
      res.end();
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
