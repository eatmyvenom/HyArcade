const https = require("https");
const http = require("http");
const config = require("../config.json");

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        let protocolObj = http;
        let method = "http:";
        if (url.startsWith("https")) {
            protocolObj = https;
            method = "https:";
        }

        let reqOptions = {
            timeout: config.watchdogTimeout,
            family: 4,
            port: method == "http:" ? 80 : 443,
            protocol: method,
        };

        let req = protocolObj.get(url, reqOptions, (res) => {
            let reply = "";
            res.on("data", (d) => {
                reply += d;
            });
            res.on("end", () => {
                resolve({
                    data: reply,
                    headers: res.headers,
                    status: res.statusCode,
                });
            });
            res.on("error", (err) => {
                reject(err);
            });
        });

        req.on("timeout", reject);
    });
}

module.exports = async function webRequest(url) {
    return await sendRequest(url);
};
