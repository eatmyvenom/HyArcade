const https = require("https");
const http = require("http");

class webResponse {
    data = "";
    headers = [];
    status = 200;
    /**
     * Creates an instance of webResponse.
     * @param {String} data the raw data recived from the server
     * @param {Object[]} headers the http response headers
     * @param {Number} status the status code
     * @memberof webResponse
     */
    constructor(data, headers, status) {
        this.data = data;
        this.headers = headers;
        this.status = status;
    }
}

/**
 * Send a get request and return response as a promise
 *
 * @param {String} url The url to send the request to
 * @return {webResponse}
 */
function sendRequest(url) {
    return new Promise((resolve, reject) => {
        let protocolObj = http;
        let method = "http:";
        if (url.startsWith("https")) {
            protocolObj = https;
            method = "https:";
        }

        let reqOptions = {
            family: 4,
            port: method == "http:" ? 80 : 443,
            protocol: method,
        };

        try {
            let req = protocolObj.get(url, reqOptions, (res) => {
                let reply = "";
                res.on("data", (d) => {
                    reply += d;
                });
                res.on("end", () => {
                    resolve(new webResponse(reply, res.headers, res.statusCode));
                });
                res.on("error", (err) => {
                    reject(err);
                });
            });
        } catch (e) {
            return sendRequest(url);
        }
    });
}

module.exports = async function webRequest(url) {
    return await sendRequest(url);
};
