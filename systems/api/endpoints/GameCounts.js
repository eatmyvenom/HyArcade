const { HypixelApi } = require("@hyarcade/requests");
const MongoConnector = require("@hyarcade/requests/MongoConnector");
const RedisInterface = require("@hyarcade/requests/RedisInterface");
const cfg = require("@hyarcade/config").fromJSON();

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
    if (await redisInterface.exists("counts")) {
      counts = await redisInterface.getJSON("counts");
    } else {
      counts = await HypixelApi.counts();
      await redisInterface.setJSON("counts", counts, cfg.database.cacheTime.counts);
    }

    res.write(JSON.stringify(counts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
