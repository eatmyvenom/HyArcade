const process = require("process");
const { URL } = require("url");
const logger = require("@hyarcade/logger");
const { LoggerInstance } = require("@hyarcade/logger");
const AccessLogger = new LoggerInstance("Access", "📄");
const { DupeKeyError, MissingFieldError, DataNotFoundError } = require("@hyarcade/errors");
const MongoConnector = require("@hyarcade/requests/MongoConnector");
const EndpointStorage = require("./EndpointStorage");
const RateLimiter = require("./RateLimiter");
const RedisInterface = require("@hyarcade/requests/RedisInterface");
const APIRuntime = require("./APIRuntime");
const cfg = require("@hyarcade/config").fromJSON();

let mongo;
let redis;

const endpoints = new EndpointStorage();

/**
 * @param {Request} request
 * @param {Response} response
 */
async function callback(request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const reqPath = url.pathname.split("/").slice(1);
  const endpoint = reqPath[0];
  const address = request.headers["x-real-ip"];

  if (!endpoints.initialized) {
    await endpoints.loadAll();
  }

  const mod = endpoints.all[endpoint];

  if (address == undefined && request.headers.authorization != cfg.database.pass) {
    AccessLogger.err(`Null requester attempted, denying connection (${address})`);
    response.write(JSON.stringify({ success: false }));
    response.end();
    return;
  }
  AccessLogger.verbose(`${address} - ${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);

  let rateLimit;
  try {
    rateLimit = await RateLimiter(address, endpoint, request.headers.key, request.headers.authorization, mongo);
  } catch (error) {
    if (error instanceof DupeKeyError) {
      response.write(JSON.stringify({ success: false, reason: "DUPLICATE-KEY" }));
      return;
    } else {
      logger.error(error.stack);
    }
  }

  if (rateLimit > 0) {
    response.statusCode = 403;
    response.setHeader("x-retry-after", rateLimit);
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify({ success: false, reason: "RATELIMIT", timeout: rateLimit }));
    response.end();
    logger.warn(`${address} rate limited for ${rateLimit}ms`);
    return;
  }

  if (mod == undefined) {
    AccessLogger.err(`${address} attempted nonexistent endpoint '${endpoint}'`);
    response.statusCode = 404;
    response.end();
  } else {
    try {
      const runtime = new APIRuntime(url, mongo, redis, cfg);
      await mod(request, response, runtime);
    } catch (error) {
      if (error instanceof MissingFieldError) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.write(
          JSON.stringify({ success: false, cause: "Missing Field(s)", message: error.message, neededFields: error.neededFields }),
        );
        response.end();
      } else if (error instanceof DataNotFoundError) {
        response.statusCode = 404;
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify({ success: false, cause: "Data not found" }));
        response.end();
      } else {
        logger.err(`${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);
        logger.err(error.stack);
        response.statusCode = 404;
        response.end();
      }
    }
  }
}

/**
 * @param port
 */
async function Server(port) {
  logger.name = "API";
  logger.emoji = "⚡";

  mongo = new MongoConnector();
  await mongo.connect();

  redis = new RedisInterface(cfg.redis.url);
  await redis.connect();

  cfg.autoRefresh();

  process.on("beforeExit", code => {
    logger.log(`Exiting process with code : ${code}`);
  });

  const server = require("http").createServer(callback).listen({ port, hostname: "localhost" });

  server.on("close", (...args) => logger.log(...args));
  server.on("error", e => {
    logger.err(e.stack);
  });
}

if (require.main == module) {
  Server(6000)
    .then(() => {})
    .catch(error => logger.err(error.stack));
}

module.exports = Server;
