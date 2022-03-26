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

    redis.addLeaderboard(lb, "daily");
    await redis.leaderboards[lb].setMany(daily);

    const weekly = await Database.getLeaderboard(lb, undefined, "weekly", false, false, 1000);

    redis.addLeaderboard(lb, "weekly");
    await redis.leaderboards[lb].setMany(weekly);

    const monthly = await Database.getLeaderboard(lb, undefined, "monthly", false, false, 1000);

    redis.addLeaderboard(lb, "monthly");
    await redis.leaderboards[lb].setMany(monthly);
  }

  await redis.destroy();
}

module.exports = main;
