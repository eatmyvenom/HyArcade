const listUtils = require("../../listUtils");
const FileCache = require("../../utils/files/FileCache")
const utils = require("../../utils");

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
    const url = new URL(req.url, `https://${req.headers.host}`);
    let lbprop = url.searchParams.get("path");
    let category = url.searchParams.get("category");
    let timePeriod = url.searchParams.get("time");
    if (req.method == "GET") {
        res.setHeader("Content-Type", "application/json");
        let accounts = fileCache.accounts;

        if (timePeriod == undefined) {
            if (category == null) {
                accounts = await [].concat(accounts).sort((b, a) => {
                    return numberify(a[lbprop]) - numberify(b[lbprop]);
                });
            } else {
                accounts = await [].concat(accounts).sort((b, a) => {
                    return numberify(a[category][lbprop]) - numberify(b[category][lbprop]);
                });
            }
        } else {
            accounts = await listUtils.listDiffByProp("accounts", lbprop, "day", 300, category, fileCache);
        }

        accounts = accounts.slice(0, Math.min(accounts.length, 300));

        res.write(JSON.stringify(accounts));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
};
