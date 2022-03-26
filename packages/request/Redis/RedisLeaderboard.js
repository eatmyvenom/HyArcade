const redis = require("redis");

class RedisLeaderboard {
  name = "";
  time = "";

  /** @type {redis.RedisClientType} */
  client;

  constructor(name, time, client) {
    this.name = name;
    this.time = time;
    this.client = client;
  }

  async setMany(accs) {
    return await this.client.ZADD(
      `hyarcade:lb:${this.time}:${this.name}`,
      accs.map(acc => {
        return { score: acc.lbProp, value: `${acc.uuid}` };
      }),
    );
  }

  async setOne(acc) {
    return await this.client.ZADD(`hyarcade:lb:${this.time}:${this.name}`, [{ score: acc.lbProp, value: `${acc.uuid}` }]);
  }

  async delMany(max, min) {
    return await this.client.ZREMRANGEBYSCORE(`hyarcade:lb:${this.time}:${this.name}`, min, max);
  }

  async getRange(length) {
    return await this.client.ZRANGE_WITHSCORES(`hyarcade:lb:${this.time}:${this.name}`, 0, length, { REV: true });
  }

  async getRank(uuid) {
    return await this.client.ZRANK(`hyarcade:lb:${this.time}:${this.name}`, uuid);
  }

  async destroy() {
    return await this.client.DEL(`hyarcade:lb:${this.time}:${this.name}`);
  }
}

module.exports = RedisLeaderboard;
