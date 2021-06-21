const webRequest = require("./webRequest");

module.exports = class hypixelReq {
    url = "";
    headers = {};
    /**
     * Creates an instance of hypixelReq.
     * @param {String} url
     */
    constructor(url) {
        this.url = url;
    }

    /**
     * Send the request to hypixel
     *
     * @return {String}
     */
    async makeRequest() {
        let req = await webRequest(this.url);
        this.headers = req.headers;
        return req.data;
    }
};
