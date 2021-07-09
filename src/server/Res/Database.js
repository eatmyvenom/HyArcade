const FileCache = require("../../utils/files/FileCache")

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
    } else {
        res.statusCode = 404;
        res.end();
    }
};
