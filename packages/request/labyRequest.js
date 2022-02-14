const { Buffer } = require("safe-buffer");
const webReq = require("./webRequest");

/**
 * Send a request to laby mod servers for a cape
 *
 * @param {string} uuid
 * @returns {Buffer}
 */
async function reqLabyCape(uuid) {
  return await webReq(`https://dl.labymod.net/capes/${uuid}`);
}

class labyRequest {
  uuid = "";
  headers = {};
  status = 404;
  data = "";

  /**
   * Creates an instance of labyRequest.
   *
   * @param {string} uuid
   * @memberof labyRequest
   */
  constructor(uuid) {
    this.uuid = uuid;
  }

  /**
   * Sends the request to the optifine server and sets object data accordingly
   *
   * @memberof labyRequest
   */
  async makeRequest() {
    const res = await reqLabyCape(this.uuid);
    this.headers = res.headers;
    this.status = res.status;
    this.data = res.data;
  }

  /**
   * Returns if the player has a cape
   *
   * @returns {boolean}
   */
  hasCape() {
    return this.status != 404;
  }

  /**
   * Return the capes raw png
   *
   * @returns {Buffer}
   */
  getCapePNG() {
    return this.data;
  }
}

module.exports = labyRequest;
