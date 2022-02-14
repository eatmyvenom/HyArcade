module.exports = class HyarcadeRequests {
  static HypixelApi = require("./HypixelApi");
  static hypixelReq = require("./hypixelReq");
  static labyRequest = require("./labyRequest");
  static mojangRequest = require("./mojangRequest");
  static optifineRequest = require("./optifineRequest");
  static webRequest = require("./webRequest");

  static types = {
    Account: require("./types/Account"),
    AccountArray: require("./types/AccountArray"),
  };
};
