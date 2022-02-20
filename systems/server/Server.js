const process = require("process");
const { URL } = require("url");
const logger = require("hyarcade-logger");
const { DupeKeyError } = require("hyarcade-errors");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const EndpointStorage = require("./EndpointStorage");
const RateLimiter = require("./RateLimiter");

/**
 * @type {MongoConnector}
 */
let connector;

let endpoints = new EndpointStorage();

/**
 * @param {Request} request
 * @param {Response} response
 */
async function callback(request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.slice(1).toLowerCase();
  const address = request.headers["x-real-ip"] ?? request.socket.remoteAddress;

  if (!endpoints.initialized) {
    await endpoints.loadAll();
  }

  const mod = endpoints.all[endpoint];

  if (address == undefined) {
    logger.err("Null requester attempted, denying connection");
  }
  logger.verbose(`${address} - ${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);

  let rateLimit;
  try {
    rateLimit = RateLimiter(address, endpoint, request.headers["key"], request.headers.authorization);
  } catch (error) {
    if (error instanceof DupeKeyError) {
      response.write(JSON.stringify({ success: false, reason: "DUPLICATE-KEY" }));
    }
  }

  if (rateLimit > 0) {
    response.statusCode = 403;
    response.setHeader("x-retry-after", rateLimit);
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify({ success: false, reason: "RATELIMIT" }));
    response.end();
    logger.warn(`${address} rate limited for ${rateLimit}ms`);
    return;
  }

  if (mod == undefined) {
    logger.err(`Attempted nonexistent endpoint '${endpoint}'`);
    response.statusCode = 404;
    response.end();
  } else {
    try {
      await mod(request, response, connector);
      logger.verbose("request completed");
    } catch (error) {
      logger.err(`${request.method?.toUpperCase()} ${url.pathname} (${url.searchParams})`);
      logger.err(error.stack);
      response.statusCode = 404;
      response.end();
    }
  }
}

module.exports = async function Server(port) {
  logger.name = "API";
  logger.emoji = "⚡";
  connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect();

  process.on("beforeExit", code => {
    logger.log(`Exiting process with code : ${code}`);
  });

  const server = require("http").createServer(callback).listen({ port, hostname: "localhost" });

  server.on("close", (...args) => logger.log(...args));
  server.on("error", e => {
    logger.err(e.stack);
  });

  process.on("SIGINT", async signal => {
    logger.log(`Exiting process with signal : ${signal}`);

    process.exit(0);
  });
};
