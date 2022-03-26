const { RedisInterface } = require("hyarcade-requests");

const cfg = require("hyarcade-config").fromJSON();

/**
 * @param args
 */
async function main(args) {
  const redis = new RedisInterface(cfg.redis.url);
  await redis.connect();

  console.log(await redis.getLeaderboard(args[3], args[4]).getRange(50));

  await redis.destroy();
}

module.exports = main;
