const { MissingFieldError } = require("hyarcade-errors");
const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const { Guild } = require("hyarcade-structures");

/**
 * @param lbprop
 * @param timePeriod
 * @param reverse
 * @param max
 * @param {MongoConnector} connector
 * @returns {Promise<Guild>}
 */
async function getLeaderboard(lbprop, timePeriod, reverse, max, connector) {
  Logger.verbose("Getting guild leaderboard");

  const accs = await (timePeriod == undefined || timePeriod == "life" || timePeriod == "lifetime" || timePeriod == undefined || timePeriod == ""
    ? connector.getGuildLeaderboard(lbprop, reverse, max)
    : connector.getGuildHistoricalLeaderboard(lbprop, timePeriod, reverse, max));

  return accs;
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);

  const lbprop = url.searchParams.get("path");
  const timePeriod = url.searchParams.get("time");
  const reverse = url.searchParams.has("reverse");
  const max = Math.min(url.searchParams.get("max") ?? 200, 1000);

  if (lbprop == undefined) {
    throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
  }

  if (req.method == "GET") {
    Logger.log(`Guild Leaderboard: ${lbprop} - ${timePeriod} - ${max}`);
    const guilds = await getLeaderboard(lbprop, timePeriod, reverse, max, connector);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(guilds));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
