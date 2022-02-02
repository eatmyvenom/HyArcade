const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const Logger = require("hyarcade-logger");

const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const GenericLeaderboard = require("../../../src/utils/leaderboard/GenericLeaderboard");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);

  const category = url.searchParams.get("category");
  const lbprop = url.searchParams.get("path");
  const timePeriod = url.searchParams.get("time");
  const min = url.searchParams.has("min");
  const reverse = url.searchParams.has("reverse");
  const max = Math.min(url.searchParams.get("max") ?? 200, 1000);
  const filter = url.searchParams.get("filter");

  if (req.method == "GET") {
    const accs = await GenericLeaderboard(category, lbprop, timePeriod, min, reverse, max, filter, fileCache);

    let acceptEncoding = req.headers["accept-encoding"];
    if (!acceptEncoding) {
      acceptEncoding = "";
    }

    const cb = () => {};
    const s = new Readable();

    s._read = () => {};

    if (!min) {
      s.push(JSON.stringify(accs));
    } else {
      let requiredKeys = [category, "name", "lbProp", "uuid", "rank", "plusColor", "mvpColor", lbprop];

      let realProp = lbprop;
      if (realProp?.startsWith(".")) {
        if (realProp.includes("[")) {
          realProp = realProp.replace(/\[/g, ".").replace(/]/g, "");
        }
        requiredKeys = [...requiredKeys, ...realProp.split(".")];
      }

      s.push(JSON.stringify(accs, requiredKeys));
    }
    // eslint-disable-next-line unicorn/no-null
    s.push(null);

    Logger.verbose("Sending data");
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
  } else {
    res.statusCode = 404;
    res.end();
  }
};
