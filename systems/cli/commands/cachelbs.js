const { Database, RedisInterface } = require("hyarcade-requests");

const cfg = require("hyarcade-config").fromJSON();

/**
 *
 */
async function main() {
  const redis = new RedisInterface(cfg.redis.url);
  await redis.connect();

  const lbs = cfg.database.cacheLbs;

  for (const lb of lbs) {
    const daily = await Database.getLeaderboard(lb, undefined, "daily", false, false, 1000);
    await redis.getLeaderboard(lb, "daily").setMany(daily);

    const weekly = await Database.getLeaderboard(lb, undefined, "weekly", false, false, 1000);
    await redis.getLeaderboard(lb, "weekly").setMany(weekly);

    const monthly = await Database.getLeaderboard(lb, undefined, "monthly", false, false, 1000);
    await redis.getLeaderboard(lb, "monthly").setMany(monthly);
  }

  await redis.destroy();
}

module.exports = main;
