const FileCache = require("../../utils/files/FileCache")

function numberify(str) {
    str = str ?? 0;
    return Number(str);
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
                    return numberify(a[category]?.[lbprop]) - numberify(b[category]?.[lbprop]);
                });
            }
        } else {
            let newAcclist = [];
            let oldCopy = JSON.parse(JSON.stringify(fileCache[timePeriod + "accounts"]))
            for(let a of oldCopy) {
                let n = fileCache.accounts.find(u=>u.uuid==a.uuid);
                if(category == null) {
                    a[lbprop] = numberify(n[lbprop] - a[lbprop]);
                    a.name = n.name;
                    newAcclist.push(a);
                } else {
                    if(a[category] != undefined) {
                        a[category][lbprop] = numberify(n[category]?.[lbprop]) - numberify(a[category]?.[lbprop]);
                        a.name = n.name;
                        newAcclist.push(a);
                    } else {
                        a[category] = {};
                        a[category][lbprop] = numberify(n[category]?.[lbprop]) - numberify(a[category]?.[lbprop]);
                        a.name = n.name;
                        newAcclist.push(a);
                    }
                }
            }
            accounts = newAcclist;
            if (category == null) {
                accounts = await [].concat(accounts).sort((b, a) => {
                    return numberify(a[lbprop]) - numberify(b[lbprop]);
                });
            } else {
                accounts = await [].concat(accounts).sort((b, a) => {
                    return numberify(a[category]?.[lbprop]) - numberify(b[category]?.[lbprop]);
                });
            }
        }

        accounts = accounts.slice(0, Math.min(accounts.length, 300));

        res.write(JSON.stringify(accounts));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
};
