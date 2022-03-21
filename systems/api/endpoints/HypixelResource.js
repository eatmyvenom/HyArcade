const { MissingFieldError, DataNotFoundError } = require("hyarcade-errors");
const { HypixelApi, MongoConnector, RedisInterface } = require("hyarcade-requests");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 * @param {RedisInterface} redisInterface
 */
module.exports = async (req, res, connector, redisInterface) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const path = url.searchParams.get("path");

    if (path == undefined) {
      throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
    }

    let data;
    if (typeof HypixelApi.resources[path] == "function") {
      if (redisInterface.exists(`hyresource-${path}`)) {
        data = await redisInterface.getJSON(`hyresource-${path}`);
      } else {
        data = await HypixelApi.resources[path]();
        await redisInterface.setJSON(`hyresource-${path}`, data, 6000);
      }
    } else {
      throw new DataNotFoundError("The specified resource does not exist");
    }

    res.write(JSON.stringify(data));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
