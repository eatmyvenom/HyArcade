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

    const { accounts } = fileCache;

    let list = accounts.filter((a) => {
      if(a.nameHist && a.nameHist.length > 0) {
        for(const name of a.nameHist) {
          if(name.toLowerCase().startsWith(ign)) {
            return true;
          }
        }
      }
      return false;
    });

    list = list.map((a) => a.name);

    res.write(JSON.stringify(list.slice(0, Math.min(list.length, 20))));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
