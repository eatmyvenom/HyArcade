const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const MiniWallsLeaderboard = require("../../../src/utils/leaderboard/MiniWallsLeaderboard");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const stat = url.searchParams.get("stat");
  const time = url.searchParams.get("time");
  if (req.method == "GET") {
    Logger.info(`Mini Walls Leaderboard: ${stat} - ${time}`);
    res.setHeader("Content-Type", "application/json");

    const leaderboard = JSON.stringify(await MiniWallsLeaderboard(connector, stat, time));

    res.write(leaderboard);
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
