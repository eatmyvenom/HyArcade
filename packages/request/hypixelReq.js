const webRequest = require("./webRequest");

module.exports = class hypixelReq {
  url = "";
  headers = {};
  /**
   * Creates an instance of hypixelReq.
   *
   * @param {string} url
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * Send the request to hypixel
   *
   * @returns {string}
   */
  async makeRequest() {
    const req = await webRequest(this.url);
    this.headers = req.headers;
    return req.data;
  }
};
