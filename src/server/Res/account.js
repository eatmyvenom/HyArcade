const {URL} = require("url");
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
        const ign = url.searchParams.get("ign");
        const uuid = url.searchParams.get("uuid");
        const discid = url.searchParams.get("discid");
        res.setHeader("Content-Type", "application/json");
        const {accounts} = fileCache;
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
                    for(const name of a.nameHist) {
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
                const newAccs = [];
                if(fileCache.accounts.find((a) => a.uuid == json.uuid)) {
                    for(const a of fileCache.accounts) {
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
