const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");

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
    try {
      const req = await axios.get(this.url.toString(), {
        validateStatus(status) {
          return status < 500 && status != 403;
        },
      });

      this.headers = req.headers;
      return req.data;
    } catch (error) {
      if (error.response) {
        Logger.error(`Hypixel responded with ${error.response.status}`);
        Logger.error(error.response.headers);
        Logger.error(error.response.data);

        if (error.response?.status ?? 0 == 403) {
          Logger.error("Your hypixel API key is invalid!");
        }
      }
    }
  }
};
