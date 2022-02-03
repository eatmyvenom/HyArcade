/* eslint-disable unicorn/no-null */
const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const MongoConnector = require("hyarcade-requests/MongoConnector");

/**
 *
 * @param {string} category the object to fetch from each account
 * @param {string} lbprop the property to fetch from each account
 * @param {string} timePeriod the time period to get the data from
 * @param {boolean} reverse whether the leaderboard should be reversed to show lowest values
 * @param {string} max the maximum amount of accounts to return
 * @param {string} filter Stats that if present excludes people from the list, must be top level
 * @param {MongoConnector} connector The mongodb connection
 * @returns {Promise<Account[]>}
 */
module.exports = async function (category, lbprop, timePeriod, reverse, max, filter = false, connector) {
  Logger.verbose("Getting leaderboard");
  const dotNotated = `${category ?? ""}.${lbprop}`.replace(/^\./, "").replace(/\.\./g, ".");

  let realFilter = false;
  if (filter && !Array.isArray(filter)) {
    realFilter = [filter];
  }

  const accs = await (timePeriod == undefined || timePeriod == "life" || timePeriod == "lifetime" || timePeriod == null || timePeriod == ""
    ? connector.getLeaderboard(dotNotated, reverse, max, realFilter)
    : connector.getHistoricalLeaderboard(dotNotated, timePeriod, reverse, max, realFilter));

  return accs;
};
