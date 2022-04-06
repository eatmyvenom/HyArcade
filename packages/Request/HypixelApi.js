/* eslint-disable unicorn/consistent-destructuring */
const process = require("process");
const url = require("url");
const config = require("@hyarcade/config").fromJSON();
const logger = require("@hyarcade/logger");
const sleep = require("@hyarcade/utils/Sleep");
const hypixelReq = require("./hypixelReq");
const Logger = require("@hyarcade/logger");
const { default: axios } = require("axios");

/**
 * Function to get the key to use
 *
 * @returns {string}
 */
function getKey() {
  let { key } = config;
  if (config.cluster) {
    key = config.clusters[config.cluster].key;
  }

  if (process.argv[2] == "bot" || process.argv[2] == "serveDB" || Logger.name == "API") {
    key = config.hypixel.botKey;
  }

  return key;
}

module.exports = class HypixelApi {
  endpoint = "";
  args = {};
  reqUrl = "";

  constructor(endpoint, args = {}) {
    this.endpoint = endpoint;
    this.args = args;
    args.key = getKey();
    const urlargs = new url.URLSearchParams(args);
    this.reqUrl = new url.URL(`${endpoint}?${urlargs.toString()}`, "https://api.hypixel.net");
  }

  async makeRequest() {
    Logger.verbose(`Querying Hypixel /${this.endpoint}`);
    const apiPoint = new hypixelReq(this.reqUrl.toString());
    let response = await apiPoint.makeRequest();

    while (apiPoint.headers["retry-after"]) {
      if (config.logRateLimit) {
        logger.warn(`Rate limit hit, retrying after ${apiPoint.headers["retry-after"]} seconds`);
      }
      await sleep(1000 + apiPoint.headers["retry-after"] * 1001);
      response = await apiPoint.makeRequest();
    }
    return response;
  }

  static async key() {
    const Api = new HypixelApi("key");
    const data = await Api.makeRequest();
    return data;
  }

  /**
   *
   * @param {string} uuid
   * @returns {Promise<object>}
   */
  static async player(uuid) {
    const Api = new HypixelApi("player", {
      uuid,
    });
    return await Api.makeRequest();
  }

  static async friends(uuid) {
    const Api = new HypixelApi("friends", {
      uuid,
    });
    return await Api.makeRequest();
  }

  static async recentgames(uuid) {
    const Api = new HypixelApi("recentgames", {
      uuid,
    });
    return await Api.makeRequest();
  }

  static async status(uuid) {
    const Api = new HypixelApi("status", {
      uuid,
    });
    return await Api.makeRequest();
  }

  static async guild(something) {
    let Api;
    if (something.length == 24) {
      Api = new HypixelApi("guild", {
        id: something,
      });
    } else if (something.length == 32 || something.length == 36) {
      Api = new HypixelApi("guild", {
        player: something,
      });
    } else {
      Api = new HypixelApi("guild", {
        name: something,
      });
    }
    return await Api.makeRequest();
  }

  static async counts() {
    const Api = new HypixelApi("counts");
    return await Api.makeRequest();
  }

  static async leaderboards() {
    const Api = new HypixelApi("leaderboards");
    return await Api.makeRequest();
  }

  static async boosters() {
    const Api = new HypixelApi("boosters");
    return await Api.makeRequest();
  }

  static async punishmentstats() {
    const Api = new HypixelApi("punishmentstats");
    return await Api.makeRequest();
  }

  static resources = {
    async games() {
      const req = await axios.get("https://api.hypixel.net/resources/games");
      return await req.data;
    },

    async challenges() {
      const req = await axios.get("https://api.hypixel.net/resources/challenges");
      return await req.data;
    },

    async achievements() {
      const req = await axios.get("https://api.hypixel.net/resources/achievements");
      return await req.data;
    },

    async quests() {
      const req = await axios.get("https://api.hypixel.net/resources/quests");
      return await req.data;
    },

    guilds: {
      async achievements() {
        const req = await axios.get("https://api.hypixel.net/resources/guilds/achievements");
        return await req.data;
      },
    },

    vanity: {
      async pets() {
        const req = await axios.get("https://api.hypixel.net/resources/vanity/pets");
        return await req.data;
      },

      async companions() {
        const req = await axios.get("https://api.hypixel.net/resources/vanity/companions");
        return await req.data;
      },
    },

    skyblock: {
      async collections() {
        const req = await axios.get("https://api.hypixel.net/resources/skyblock/collections");
        return req.data;
      },

      async skills() {
        const req = await axios.get("https://api.hypixel.net/resources/skyblock/skills");
        return req.data;
      },

      async items() {
        const req = await axios.get("https://api.hypixel.net/resources/skyblock/items");
        return req.data;
      },

      async election() {
        const req = await axios.get("https://api.hypixel.net/resources/skyblock/items");
        return req.data;
      },
    },
  };

  static skyblock = {
    async news() {
      const Api = new HypixelApi("skyblock/news", {});
      return await Api.makeRequest();
    },

    async auction(uuid, player, profile) {
      const Api = new HypixelApi("skyblock/auction", { uuid, player, profile });
      return await Api.makeRequest();
    },

    async auctions(page) {
      const Api = new HypixelApi("skyblock/auctions", { page });
      return await Api.makeRequest();
    },

    // eslint-disable-next-line camelcase
    async auctions_ended() {
      const Api = new HypixelApi("skyblock/auctions_ended", {});
      return await Api.makeRequest();
    },

    async bazaar() {
      const Api = new HypixelApi("skyblock/bazaar", {});
      return await Api.makeRequest();
    },

    async profile(profile) {
      const Api = new HypixelApi("skyblock/profile", { profile });
      return await Api.makeRequest();
    },

    async profiles(uuid) {
      const Api = new HypixelApi("skyblock/profiles", { uuid });
      return await Api.makeRequest();
    },
  };
};
