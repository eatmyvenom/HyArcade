const listUtils = require("../../listUtils");
const utils = require("../../utils");

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

module.exports = async (req, res) => {
    const url = new URL(req.url, `https://${req.headers.host}`);
    let lbprop = url.searchParams.get("path");
    let category = url.searchParams.get("category");
    let timePeriod = url.searchParams.get("time");
    if(req.method == "GET") {
        res.setHeader('Content-Type', 'text/json');
        let accounts = await utils.readJSON('accounts.json');

        if(timePeriod == undefined) {
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
            accounts = await listUtils.listDiffByProp("accounts", lbprop, "day", 300, category);
        }

        accounts = accounts.slice(0, Math.min(accounts.length, 300));

        res.write(JSON.stringify(accounts));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
}