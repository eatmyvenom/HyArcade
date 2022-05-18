/* eslint-disable unicorn/no-null */
const { Account } = require("@hyarcade/account");
const Logger = require("@hyarcade/logger");
const MongoConnector = require("@hyarcade/requests/MongoConnector");
const RedisInterface = require("@hyarcade/requests/RedisInterface");

/**
 *
 * @param {string} category the object to fetch from each account
 * @param {string} lbprop the property to fetch from each account
 * @param {string} timePeriod the time period to get the data from
 * @param {boolean} reverse whether the leaderboard should be reversed to show lowest values
 * @param {string} max the maximum amount of accounts to return
 * @param noCache
 * @param {MongoConnector} connector The mongodb connection
 * @param {RedisInterface} redisInterface
 * @returns {Promise<Account[]>}
 */
module.exports = async function (category, lbprop, timePeriod, reverse, max, noCache, connector, redisInterface) {
  Logger.verbose("Getting leaderboard");
  const time = timePeriod == "day" ? "daily" : timePeriod;
  const dotNotated = `${category ?? ""}.${lbprop}`.replace(/\.+/g, ".").replace(/^\./, "");

  let accs;

  if (time == undefined || time == "life" || time == "lifetime" || time == null || time == "") {
    accs = await connector.getLeaderboard(dotNotated, reverse, max);
  } else {
    if ((await redisInterface.exists(`lb:${time}:${dotNotated}`)) && !noCache) {
      const list = await redisInterface.getLeaderboard(dotNotated, time).getRange(max);

      const uuids = list.map(li => li.value);

      const accCursor = connector.accounts.find(
        { uuid: { $in: uuids } },
        { projection: { _id: 0, uuid: 1, name: 1, rank: 1, plusColor: 1, mvpColor: 1 } },
      );
      const displayAccs = await accCursor.toArray();

      accs = [];
      for (const lilAcc of list) {
        const displayData = displayAccs.find(a => a.uuid == lilAcc.value);
        accs.push({ ...displayData, lbProp: lilAcc.score });
      }
    } else {
      accs = await connector.getHistoricalLeaderboard(dotNotated, time, reverse, max);
    }
  }

  return accs;
};
