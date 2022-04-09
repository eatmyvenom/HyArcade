const redis = require("redis");
const { LoggerInstance } = require("@hyarcade/logger");
const RedisLeaderboard = require("./Redis/RedisLeaderboard");

const Logger = new LoggerInstance("Redis", "🔔");

class RedisInterface {
  /** @type {redis.RedisClientType} */
  client;

  leaderboards = {};

  constructor(url) {
    this.client = redis.createClient({ url });

    this.client.on("error", error => Logger.error(error));
    this.client.on("ready", () => Logger.log("Redis connection established..."));
  }

  async connect() {
    await this.client.connect();
  }

  async set(key, value, expire) {
    await this.client.SET(`hyarcade:${key}`, value, expire ? { EX: expire } : undefined);
  }

  async get(key) {
    return await this.client.GET(`hyarcade:${key}`);
  }

  async setJSON(key, value, expire) {
    await this.client.SET(`hyarcade:${key}`, JSON.stringify(value), expire ? { EX: expire } : undefined);
  }

  async getJSON(key) {
    const str = await this.client.GET(`hyarcade:${key}`);

    return JSON.parse(str);
  }

  async exists(key) {
    const res = await this.client.EXISTS(`hyarcade:${key}`);
    return res == 1;
  }

  async destroy() {
    await this.client.QUIT();
  }

  addLeaderboard(name, time) {
    const lb = new RedisLeaderboard(name, time, this.client);
    this.leaderboards[`${name}:${time}`] = lb;
    return lb;
  }

  getLeaderboard(name, time) {
    return this.leaderboards[`${name}:${time}`] ? this.leaderboards[`${name}:${time}`] : this.addLeaderboard(name, time);
  }

  async delLeaderboard(name) {
    this.leaderboards[name].destroy();
    delete this.leaderboards[name];
  }
}

module.exports = RedisInterface;
