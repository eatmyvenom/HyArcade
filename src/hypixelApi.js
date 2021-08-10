const process = require("process");
const hypixelReq = require("./request/hypixelReq");
const {
  sleep,
  logger
} = require("./utils");
const config = require("./Config").fromJSON();

/**
 * Function to get the key to use
 *
 * @returns {string} Hypixel api key
 */
function getKey () {
  let {
    key
  } = config;
  if(config.cluster) {
    key = config.clusters[config.cluster].key;
  }
  if(process.argv[2] == "bot") {
    key = config.clusters.serverbot.key;
  }
  if(config.mode == "test") {
    key = config.altkeys[Math.floor(Math.random() * config.altkeys.length)];
  }
  return key;
}

module.exports = class hypixelAPI {
  /**
   * Get the raw data from a specified url
   *
   * @static
   * @param {string} url the url to query
   * @returns {string} raw data from hypixel api
   */
  static async getData (url) {
    const apiPoint = new hypixelReq(url);
    let response = await apiPoint.makeRequest();

    // Hypixel api put the amount of time you have to wait
    // upon rate limit within the response headers. If this
    // exists, wait that amount of time in seconds then
    // make a new request.
    while(apiPoint.headers["retry-after"]) {
      if(config.logRateLimit) {
        logger.warn(`Rate limit hit, retrying after ${apiPoint.headers["retry-after"]} seconds`);
      }
      await sleep(apiPoint.headers["retry-after"] * 1000);
      response = await apiPoint.makeRequest();
    }
    return response;
  }

  /**
   * Send a web request to hypixel with url a encoded request
   *
   * @static
   * @param {string} page The endpoint to get
   * @param {object} [extraArgs=[]] any other url params
   * @returns {string} the raw response
   */
  static async basicRequest (page, extraArgs = []) {
    let url = `https://api.hypixel.net/${page}?key=${getKey()}`;
    // this is my handling of adding other args that work
    // in urls, its not perfect but it works well here
    if(extraArgs != []) {
      for(let i = 0; i < extraArgs.length; i += 1) {
        url += `&${extraArgs[i].key}=${extraArgs[i].val}`;
      }
    }

    const data = await hypixelAPI.getData(url);
    return data;
  }

  /**
   * Returns the status for the player with a specified uuid
   *
   * @static
   * @param {string} uuid the players uuid
   * @returns {string} the raw json player status
   */
  static async getStatusRAW (uuid) {
    return await hypixelAPI.basicRequest("status", [{
      key: "uuid",
      val: uuid
    }]);
  }

  /**
   * Returns the stats for a player with a specified uuid
   *
   * @static
   * @param {string} uuid the players uuid
   * @returns {string} the raw account data
   */
  static async getAccountDataRaw (uuid) {
    return await hypixelAPI.basicRequest("player", [{
      key: "uuid",
      val: uuid
    }]);
  }

  /**
   * Returns the object status for a player with a specified uuid
   *
   * @static
   * @param {string} uuid the players uuid
   * @returns {object} the raw account data
   */
  static async getAccountData (uuid) {
    const data = await hypixelAPI.getAccountDataRaw(uuid);
    try {
      const json = JSON.parse(data);
      return json;
    } catch (e) {
      logger.err("Hypixel sent malformed json");
      logger.err(data);
      return await hypixelAPI.getAccountData(uuid);
    }
  }

  static async getStatus (uuid) {
    const data = await hypixelAPI.getStatusRAW(uuid);
    try {
      const json = JSON.parse(data);
      return json;
    } catch (e) {
      logger.err("Hypixel sent malformed json");
      logger.err(data);
      return await hypixelAPI.getStatusRAW(uuid);
    }
  }

  static async getBoosters () {
    const data = await hypixelAPI.basicRequest("boosters");
    try {
      const json = JSON.parse(data);
      return json;
    } catch (e) {
      logger.err("Hypixel sent malformed json");
      logger.err(data);
      return await hypixelAPI.getBoosters();
    }
  }

  /**
   * Returns the amount of players in various games
   *
   * @static
   * @returns {string} raw counts of hypixel games
   */
  static async getGameCountsRAW () {
    // dont put empty array since that is automatically done
    return await hypixelAPI.basicRequest("gameCounts");
  }

  static async getLeaderboardsRAW () {
    // dont put empty array since that is automatically done
    return await hypixelAPI.basicRequest("leaderboards");
  }

  /**
   * Returns the data of a guild with a specific id
   *
   * @static
   * @param {string} id the interal id that hypixel assigned to this guild
   * @returns {string} the guild object
   */
  static async getGuildRaw (id) {
    return await hypixelAPI.basicRequest("guild", [{
      key: "id",
      val: id
    }]);
  }

  /**
   * Returns the data of a guild that a player is in
   *
   * @static
   * @param {string} uuid The players uuid
   * @returns {string} the guild object
   */
  static async getGuildFromPlayer (uuid) {
    return await hypixelAPI.basicRequest("guild", [{
      key: "player",
      val: uuid
    }]);
  }

  /**
   * Get the wins for an account with a specified uuid
   *
   * @static
   * @param {string} uuid The players uuid
   * @returns {number} the total party games wins
   */
  static async getAccountWins (uuid) {
    const json = await hypixelAPI.getAccountData(uuid);
    // make sure player has stats to be checked
    if(!json.player || !json.player.stats || !json.player.stats.Arcade) {
      return 0;
    }
    const arcade = json.player.stats.Arcade;
    let wins = 0;
    if(arcade.wins_party) wins += arcade.wins_party;
    if(arcade.wins_party_2) wins += arcade.wins_party_2;
    if(arcade.wins_party_3) wins += arcade.wins_party_3;
    return wins;
  }

  /**
   * The objectified status of a player with a given uuid
   *
   * @static
   * @param {string} uuid the players uuid
   * @returns {object} the Object status of the player
   */
  static async getUUIDStatus (uuid) {
    const raw = await hypixelAPI.getStatusRAW(uuid);
    const json = JSON.parse(raw);
    return json.session;
  }

  static async getGamesPlayedRAW (uuid) {
    return await hypixelAPI.basicRequest("recentGames", [{
      key: "uuid",
      val: uuid
    }]);
  }

  /**
   * The objectified counts of players in various games
   *
   * @static
   * @returns {object} Object with counts of players in various hypixel games
   */
  static async getGameCounts () {
    const data = await hypixelAPI.getGameCountsRAW();
    return JSON.parse(data);
  }

  static async getLeaderboards () {
    const data = await hypixelAPI.getLeaderboardsRAW();
    return JSON.parse(data);
  }
};
