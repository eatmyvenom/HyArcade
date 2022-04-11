const Config = require("@hyarcade/config");
const Logger = require("@hyarcade/logger");
const { RedisInterface } = require("@hyarcade/requests");

/**
 *
 */
async function main() {
  const r = new RedisInterface(Config.fromJSON().redis.url);
  await r.connect();
  await r.set("currentUUIDs", "[]");
  Logger.explain("currentUUIDs set to '[]'");

  await r.destroy();
}

module.exports = main;
