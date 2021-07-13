const FileCache = require("../../utils/files/FileCache");
const Logger = require("../../utils/Logger");
const cfg = require("../../Config").fromJSON()

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
    const url = new URL(req.url, `https://${req.headers.host}`);
    if (req.method == "GET") {
        res.setHeader("Content-Type", "application/json");

        let file = url.searchParams.get("path");
        let data = fileCache[file];

        if(data == undefined) {
            res.statusCode = 404;
            res.end();
        }

        res.write(JSON.stringify(data));
        res.end();
    } else if(req.method == "POST") {
        let data = "";
        let json = {};
        if(req.headers.authorization == cfg.dbPass) {
            req.on("data", d => data+=d);
            req.on("end", async () => {
                json = JSON.parse(data)
                fileCache[url.searchParams.get("path")] = json;
                await fileCache.save();
                res.end();
            });
        } else {
            Logger.warn("Someone tried to post without correct AUTH")
            res.statusCode = 403;
            res.end();
        }
    } else {
        res.statusCode = 404;
        res.end();
    }
};
