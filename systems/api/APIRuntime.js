const Config = require("@hyarcade/config");
const MongoConnector = require("@hyarcade/requests/MongoConnector");
const RedisInterface = require("@hyarcade/requests/RedisInterface");
const { URL } = require("url");

class APIRuntime {
  /** @type {MongoConnector} */
  mongoConnector;

  /** @type {RedisInterface} */
  redisInterface;

  /** @type {Config} */
  config;

  /** @type {URL} */
  url;

  constructor(url, mongo, redis, config) {
    this.url = url;
    this.mongoConnector = mongo;
    this.redisInterface = redis;
    this.config = config;
  }
}

module.exports = APIRuntime;
