const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const GenericLeaderboard = require("../../../src/utils/leaderboard/GenericLeaderboard");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);

  const category = url.searchParams.get("category");
  const lbprop = url.searchParams.get("path");
  const timePeriod = url.searchParams.get("time");
  const reverse = url.searchParams.has("reverse");
  const max = Math.min(url.searchParams.get("max") ?? 200, 1000);
  const filter = url.searchParams.get("filter");

  if (req.method == "GET") {
    Logger.info(`Leaderboard: ${category}.${lbprop} - ${timePeriod} - ${max}`);
    const accs = await GenericLeaderboard(category, lbprop, timePeriod, reverse, max, filter ?? false, connector);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(accs));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
