const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const Logger = require("hyarcade-logger");

const MongoConnector = require("hyarcade-requests/MongoConnector");
const GenericLeaderboard = require("../../../src/utils/leaderboard/GenericLeaderboard");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);

  const category = url.searchParams.get("category");
  const lbprop = url.searchParams.get("path");
  const timePeriod = url.searchParams.get("time");
  const reverse = url.searchParams.has("reverse");
  const max = Math.min(url.searchParams.get("max") ?? 200, 1000);
  const filter = url.searchParams.get("filter");

  if (req.method == "GET") {
    const accs = await GenericLeaderboard(category, lbprop, timePeriod, reverse, max, filter ?? false, connector);

    let acceptEncoding = req.headers["accept-encoding"];
    if (!acceptEncoding) {
      acceptEncoding = "";
    }

    const cb = () => {};
    const s = new Readable();

    s._read = () => {};

    // eslint-disable-next-line unicorn/no-null
    s.push(JSON.stringify(accs), null);

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
