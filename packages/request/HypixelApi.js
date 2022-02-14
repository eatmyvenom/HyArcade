/* eslint-disable unicorn/consistent-destructuring */
const process = require("process");
const url = require("url");
const config = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const sleep = require("hyarcade-utils/Sleep");
const hypixelReq = require("./hypixelReq");
const Logger = require("hyarcade-logger");

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

  if (process.argv[2] == "bot" || process.argv[2] == "serveDB") {
    key = config.clusters.serverbot.key;
  }

  if (config.mode == "test") {
    key = config.hypixel.batchKeys[Math.floor(Math.random() * config.hypixel.batchKeys.length)];
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
      await sleep(apiPoint.headers["retry-after"] * 1001);
      response = await apiPoint.makeRequest();
    }
    return response;
  }

  static async key() {
    const Api = new HypixelApi("key");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.key();
    }
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
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.player(uuid);
    }
  }

  static async friends(uuid) {
    const Api = new HypixelApi("friends", {
      uuid,
    });
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.friends(uuid);
    }
  }

  static async recentgames(uuid) {
    const Api = new HypixelApi("recentgames", {
      uuid,
    });
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.recentgames(uuid);
    }
  }

  static async status(uuid) {
    const Api = new HypixelApi("status", {
      uuid,
    });
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.status(uuid);
    }
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
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.guild(something);
    }
  }

  static async achievements() {
    const Api = new HypixelApi("resources/achievements");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.achievements();
    }
  }

  static async challenges() {
    const Api = new HypixelApi("resources/challenges");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.challenges();
    }
  }

  static async boosters() {
    const Api = new HypixelApi("boosters");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.boosters();
    }
  }

  static async counts() {
    const Api = new HypixelApi("counts");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.counts();
    }
  }

  static async leaderboards() {
    const Api = new HypixelApi("leaderboards");
    const data = await Api.makeRequest();
    try {
      return JSON.parse(data);
    } catch {
      logger.err("Hypixel sent malformed json data");
      logger.err(data);
      return await HypixelApi.leaderboards();
    }
  }
};
