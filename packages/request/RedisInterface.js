const redis = require("redis");
const LoggerInstance = require("hyarcade-logger/LoggerInstance");

const Logger = new LoggerInstance("📄", "Redis");

class RedisInterface {
  /** @type {redis.RedisClientType} */
  client;

  constructor(url) {
    this.client = redis.createClient({ url });

    this.client.on("error", error => Logger.error(error));
    this.client.on("ready", () => Logger.log("Redis connection established..."));
  }

  async connect() {
    this.client.connect();
  }

  async set(key, value, expire) {
    await this.client.set(`hyarcade:${key}`, value, expire ? { EX: expire } : undefined);
  }

  async get(key) {
    return await this.client.get(`hyarcade:${key}`);
  }

  async setJSON(key, value, expire) {
    await this.client.set(`hyarcade:${key}`, JSON.stringify(value), expire ? { EX: expire } : undefined);
  }

  async getJSON(key) {
    const str = await this.client.get(`hyarcade:${key}`);

    return JSON.parse(str);
  }

  async exists(key) {
    const res = await this.client.EXISTS(`hyarcade:${key}`);
    return res == 1;
  }

  async destroy() {
    await this.client.quit();
  }
}

module.exports = RedisInterface;
