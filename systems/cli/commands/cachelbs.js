const Logger = require("hyarcade-logger");
const { Database, RedisInterface } = require("hyarcade-requests");

const cfg = require("hyarcade-config").fromJSON();

/**
 * @param name
 * @param time
 * @param redis
 */
async function cacheLB(name, time, redis) {
  const lb = await Database.getLeaderboard(name, undefined, time, false, false, 1000, true);
  await redis.getLeaderboard(name, time).destroy();
  await redis.getLeaderboard(name, time).setMany(lb);
  await redis.getLeaderboard(name, time).setExpire(1800);
}

/**
 *
 */
async function main() {
  Logger.name = "LBCache";
  const redis = new RedisInterface(cfg.redis.url);
  await redis.connect();

  const lbs = cfg.database.cacheLbs;

  for (const lb of lbs) {
    const daily = cacheLB(lb, "daily", redis);
    const weekly = cacheLB(lb, "weekly", redis);
    const monthly = cacheLB(lb, "monthly", redis);

    await Promise.all([daily, weekly, monthly]);
  }

  await redis.destroy();
}

module.exports = main;
