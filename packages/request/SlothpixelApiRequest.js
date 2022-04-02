const cfg = require("@hyarcade/config").fromJSON();
const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");
const url = require("url");

/**
 * @param {string} endpoint
 * @returns {object}
 */
async function SendRequest(endpoint) {
  const args = {};
  args.key = cfg.thirdParty.slothPixelKey ?? "";
  const urlargs = new url.URLSearchParams(args);
  const reqUrl = new url.URL(`api/${endpoint}?${urlargs.toString()}`, "https://api.slothpixel.me");

  try {
    const req = await axios.get(reqUrl.toString(), {
      validateStatus(status) {
        return status < 400 || status == 404;
      },
    });

    this.headers = req.headers;
    return req.data;
  } catch (error) {
    if (error.response) {
      Logger.error(`Slothpixel responded with ${error.response.status}`);
      Logger.error(error.response.headers);
      Logger.error(error.response.data);

      if (error.response?.status ?? 0 == 403) {
        Logger.error("Your hypixel API key is invalid!");
      }
    }
  }
}

class SlothpixelApiRequest {
  endpoint;
  args;
  constructor(endpoint, args) {
    this.endpoint = endpoint;
    this.args = args;
  }

  async sendRequest() {
    return await SendRequest(this.endpoint, this.args);
  }

  static async player(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}`);
    return await req.sendRequest();
  }

  static async achievements(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}/achievements`);
    return await req.sendRequest();
  }

  static async quests(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}/quests`);
    return await req.sendRequest();
  }

  static async recentGames(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}/recentGames`);
    return await req.sendRequest();
  }

  static async friends(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}/friends`);
    return await req.sendRequest();
  }

  static async status(input = "") {
    const req = new SlothpixelApiRequest(`players/${input.trim()}/status`);
    return await req.sendRequest();
  }
}

module.exports = SlothpixelApiRequest;
