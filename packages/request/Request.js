module.exports = class HyarcadeRequests {
  static HypixelApi = require("./HypixelApi");
  static hypixelReq = require("./hypixelReq");
  static mojangRequest = require("./mojangRequest");

  static types = {
    Account: require("./types/Account"),
    AccountArray: require("./types/AccountArray"),
  };
};
