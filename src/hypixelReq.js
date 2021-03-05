const https = require("https");
const webRequest = require("./webRequest");

module.exports = class hypixelReq {
    url = "";
    headers = {};
    constructor(url) {
        this.url = url;
    }

    async makeRequest() {
        let req = await webRequest(this.url);
        this.headers = req.headers;
        return req.data;
    }
};
