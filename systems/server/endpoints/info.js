const process = require("process");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const accs = Object.values(fileCache.indexedAccounts);
    const mem = process.memoryUsage.rss() / 1000000;

    const obj = {
      accs: accs.length,
      guilds: fileCache.guilds.length,
      links: Object.keys(fileCache.disclist).length,
      mem,
    };

    res.write(JSON.stringify(obj));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
