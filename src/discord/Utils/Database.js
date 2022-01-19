const MiniWallsLeaderboard = require("../../utils/leaderboard/MiniWallsLeaderboard");
const DBConnector = require("hyarcade-requests/Database");
const Logger = require("hyarcade-logger");


class Database {
  
  /**
   * 
   * @param {*} json 
   * @returns {*}
   * @deprecated
   */
  static async addAccount (json) {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    return await DBConnector.addAccount(json);
  }

  /**
   * 
   * @param {*} path
   * @param {*} category
   * @param {*} time
   * @param {*} min
   * @param {*} reverse
   * @param {*} max
   * @returns {*}
   * @deprecated
   */
  static async getLeaderboard (path, category, time, min, reverse, max) {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    return await DBConnector.getLeaderboard(path, category, time, min, reverse, max);
  }

  /**
   * 
   * @param {*} stat
   * @param {*} time
   * @param {*} fileCache 
   * @returns {*}
   * @deprecated
   */
  static async getMWLeaderboard (stat, time, fileCache) {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    if(fileCache != undefined) {
      return await MiniWallsLeaderboard(fileCache, stat, time);
    }

    return await DBConnector.getMWLeaderboard(stat, time);
  }

  /**
   * 
   * @param {*} text
   * @param {*} discordID
   * @returns {*}
   * @deprecated
   */
  static async account (text, discordID) {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    return await DBConnector.account(text, discordID);
  }

  /**
   * 
   * @param {*} text
   * @param {*} discordID
   * @param {*} time
   * @returns {*}
   * @deprecated
   */
  static async timedAccount (text, discordID, time) {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    return await DBConnector.timedAccount(text, discordID, time);
  }

  /**
   * 
   * @returns {*}
   * @deprecated
   */
  static async info () {
    Logger.warn("Using deprecated database connector, use hyarcade-requests instead");
    return await DBConnector.info();
  }

}

module.exports = Database;