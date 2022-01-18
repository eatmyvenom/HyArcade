const FileCache = require("../../../src/utils/files/FileCache");
const process = require("process");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const accs = Object.values(fileCache.indexedAccounts);
    const invalid = accs.filter((a) => a.name == "INVALID-NAME").length;
    const mem = process.memoryUsage.rss() / 1000000;
    const time = process.uptime();

    const obj = {
      accs: accs.length,
      invalid,
      guilds: fileCache.guilds.length,
      links: Object.keys(fileCache.disclist).length,
      mem,
      time,
      fileSave: fileCache.modTime,
    };

    res.write(JSON.stringify(obj));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
