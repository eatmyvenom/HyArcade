const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");
const { Agent } = require("https");

module.exports = class hypixelReq {
  url = "";
  address = "";
  headers = {};

  /**
   * Creates an instance of hypixelReq.
   *
   * @param {string} url
   * @param {string} address
   */
  constructor(url, address) {
    this.url = url;
    this.address = address;
  }

  /**
   * Send the request to hypixel
   *
   * @returns {Promise<string>}
   */
  async makeRequest() {
    try {
      const options = {
        validateStatus(status) {
          return status < 500 && status != 403;
        },
      };

      if (this.address != undefined && this.address != "") {
        options.httpsAgent = new Agent({ localAddress: this.address });
      }

      const req = await axios.get(this.url.toString(), options);

      this.headers = req.headers;
      return req.data;
    } catch (error) {
      if (error.response) {
        Logger.error(`Hypixel responded with ${error.response.status}`);
        Logger.error(error.response.headers);
        Logger.error(error.response.data);

        if (error.response?.status ?? 0 === 403) {
          Logger.error("Your hypixel API key is invalid!");
        }
      }
    }
  }
};
