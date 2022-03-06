const { HypixelApi } = require("hyarcade-requests");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const RedisInterface = require("hyarcade-requests/RedisInterface");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 * @param {RedisInterface} redisInterface
 */
module.exports = async (req, res, connector, redisInterface) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    let counts;
    if (redisInterface.exists("counts")) {
      counts = await HypixelApi.counts();
      await redisInterface.setJSON("counts", counts, 600);
    }

    res.write(JSON.stringify(counts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
