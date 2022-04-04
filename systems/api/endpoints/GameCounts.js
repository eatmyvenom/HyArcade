const { HypixelApi } = require("@hyarcade/requests");
const APIRuntime = require("../APIRuntime");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  const { redisInterface, config } = runtime;
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    let counts;
    if (await redisInterface.exists("counts")) {
      counts = await redisInterface.getJSON("counts");
    } else {
      counts = await HypixelApi.counts();
      await redisInterface.setJSON("counts", counts, config.database.cacheTime.counts);
    }

    res.write(JSON.stringify(counts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
