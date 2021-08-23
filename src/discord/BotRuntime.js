const BotUtils = require("./BotUtils");

let hackerlist = null;
let blacklist = null;

module.exports = class BotRuntime {
  
  static async getHackerlist () {
    if(hackerlist == null) {
      hackerlist = BotUtils.getFromDB("hackerlist");
      setTimeout(() => hackerlist = null, 3600000);
    }

    return blacklist;
  }

  static async getBlacklist () {
    if(blacklist == null) {
      blacklist = BotUtils.getFromDB("blacklist");
      setTimeout(() => blacklist = null, 3600000);
    }

    return blacklist;
  }
};