const FileCache = require("../../utils/files/FileCache");

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

    const ign = url.searchParams.get("q");

    const {
      indexedAccounts
    } = fileCache;

    const accounts = Object.values(indexedAccounts);
    accounts.sort((b, a) => a.importance - b.importance);

    const list = [];

    accounts.forEach((a) => {
      if(a.nameHist && a.nameHist.length > 0) {
        for(const name of a.nameHist) {
          if(name.toLowerCase().startsWith(ign)) {
            list.push(a.name);
            break;
          }
        }
      }
    });

    res.write(JSON.stringify(list.slice(0, Math.min(list.length, 21))));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
