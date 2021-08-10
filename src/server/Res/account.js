const URL = require("url").URL;
const cfg = require("../../Config").fromJSON();
const Logger = require("hyarcade-logger");
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
        let ign = url.searchParams.get("ign");
        let uuid = url.searchParams.get("uuid");
        let discid = url.searchParams.get("discid");
        res.setHeader("Content-Type", "application/json");
        let accounts = fileCache.accounts;
        let acc;

        console.log(ign);
        if(ign != null) {
            acc = accounts.find((a) => a.name?.toLowerCase() == ign?.toLowerCase());
        } else if(uuid != null) {
            acc = accounts.find((a) => a.uuid?.toLowerCase() == uuid?.toLowerCase());
        } else if(discid != null) {
            acc = accounts.find((a) => a.discord == discid);
        }

        if(acc == undefined && ign != null) {
            acc = accounts.find((a) => {
                if(a.nameHist && a.nameHist.length > 0) {
                    for(let name of a.nameHist) {
                        if(name.toLowerCase().startsWith(ign)) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        if(acc == undefined) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                "error": "ACC_UNDEFINED"
            }));
            return;
        }

        res.write(JSON.stringify(acc));
        res.end();
    } else if(req.method == "POST") {
        let data = "";
        let json = {};
        if(req.headers.authorization == cfg.dbPass) {
            req.on("data", (d) => data += d);
            req.on("end", async () => {
                json = JSON.parse(data);
                let newAccs = [];
                if(fileCache.accounts.find((a) => a.uuid == json.uuid)) {
                    for(let a of fileCache.accounts) {
                        if(a.uuid != json.uuid) {
                            newAccs.push(a);
                        } else {
                            newAccs.push(json);
                        }
                    }
                } else {
                    fileCache.accounts.push(json);
                }
                await fileCache.save();
                res.end();
            });
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
