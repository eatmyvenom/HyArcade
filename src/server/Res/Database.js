const FileCache = require("../../utils/files/FileCache");
const Logger = require("hyarcade-logger");
const { logger } = require("../../utils");
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
                try {
                    json = JSON.parse(data);
                } catch (e) {
                    logger.err("JSON parsing of new database data failed");
                    logger.err(e.stack);
                    logger.debug(data);
                    res.end();
                }


                if(url.searchParams.get("path") == "accounts") {
                    Logger.log("Saving new accounts");
                    let old = fileCache[url.searchParams.get("path")];
                    let newAccs = [];

                    for(let acc of old) {
                        let newAcc = json.find((a) => a.uuid == acc.uuid);
                        logger.debug(acc?.name)
                        logger.debug(newAcc?.name)
                        if(newAcc != undefined && newAcc.updateTime > acc.updateTime) {
                            newAccs.push(newAcc);
                        } else {
                            if(acc != {}) {
                                newAccs.push(acc);
                            }
                        }
                    }

                    Logger.log(`New accounts length is ${newAccs.length}`);
                    fileCache.accounts = newAccs;

                } else {
                    fileCache[url.searchParams.get("path")] = json;
                }

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
