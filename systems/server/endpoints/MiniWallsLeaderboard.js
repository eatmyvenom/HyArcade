const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const MiniWallsLeaderboard = require("../../../src/utils/leaderboard/MiniWallsLeaderboard");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {FileCache} fileCache
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const stat = url.searchParams.get("stat");
  const time = url.searchParams.get("time");
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const leaderboard = JSON.stringify(await MiniWallsLeaderboard(fileCache, stat, time));

    res.write(leaderboard);
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
