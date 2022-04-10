const { getLeaderboard } = require("@hyarcade/database");
const Logger = require("@hyarcade/logger");
const { RedisInterface } = require("@hyarcade/requests");

const cfg = require("@hyarcade/config").fromJSON();

/**
 * @param name
 * @param time
 * @param redis
 */
async function cacheLB(name, time, redis) {
  const lb = await getLeaderboard(name, undefined, time, false, false, cfg.redis.leaderboardSize ?? 1000, true);
  const redisLB = redis.getLeaderboard(name, time);
  await redisLB.destroy();
  await redisLB.setMany(lb);
  await redisLB.setExpire(cfg.database.cacheTime.leaderboards);
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
