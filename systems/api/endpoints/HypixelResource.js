const { MissingFieldError, DataNotFoundError } = require("@hyarcade/errors");
const { HypixelApi } = require("@hyarcade/requests");
const APIRuntime = require("../APIRuntime");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  const { url, redisInterface, config } = runtime;
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const path = url.searchParams.get("path");

    if (path == undefined) {
      throw new MissingFieldError("No path specified to generate a leaderboard from", ["path"]);
    }

    let data;
    if (typeof HypixelApi.resources[path] == "function") {
      if (await redisInterface.exists(`hyresource-${path}`)) {
        data = await redisInterface.getJSON(`hyresource-${path}`);
      } else {
        data = await HypixelApi.resources[path]();
        await redisInterface.setJSON(`hyresource-${path}`, data, config.database.cacheTime.resources);
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
