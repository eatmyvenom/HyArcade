const fs = require("fs-extra");
const http = require("http");
const Logger = require("hyarcade-logger");
const GetAsset = require("hyarcade-utils/FileHandling/GetAsset");

const pages = new Set([
  "arcade",
  "blockingdead",
  "bountyhunters",
  "capturethewool",
  "dragonwars",
  "enderspleef",
  "football",
  "farmhunt",
  "galaxywars",
  "holeinthewall",
  "hideandseek",
  "hypixelsays",
  "miniwalls",
  "partygames",
  "pixelpainters",
  "seasonal",
  "throwout",
  "zombies",
]);

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function callback(request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.toLowerCase();
  const urlPath = endpoint.split("/");

  let replyData = "";

  if (request.method == "GET") {
    if (endpoint == "/") {
      replyData = await fs.readFile("html/hub.html");
    } else if (urlPath[urlPath.length - 1].endsWith(".js") || (urlPath[urlPath.length - 1].endsWith(".css") && urlPath.length < 4)) {
      if (fs.existsSync(`html/${urlPath[urlPath.length - 1]}`)) {
        replyData = await fs.readFile(`html/${urlPath[urlPath.length - 1]}`);
      } else {
        Logger.info(urlPath.length - 1);
        response.statusCode = 403;
        replyData = "";
      }
    } else if (urlPath[1] == "guilds") {
      replyData = await fs.readFile("html/guild.html");
    } else if (urlPath[1] == "assets") {
      if (fs.existsSync(GetAsset(`site/images/${urlPath[2]}`))) {
        replyData = await fs.readFile(GetAsset(`site/images/${urlPath[2]}`));
      } else {
        Logger.info(urlPath[2]);
        response.statusCode = 403;
        replyData = "";
      }
    } else if (pages.has(endpoint.slice(1))) {
      replyData = await fs.readFile("html/generic.html");
    } else {
      switch (endpoint) {
        case "/github": {
          response.writeHead(302, {
            Location: "https://github.com/eatmyvenom/hyarcade",
          });
          break;
        }

        default: {
          Logger.warn(`${endpoint} redirected to home`);
          replyData = await fs.readFile("html/hub.html");
        }
      }
    }

    response.write(replyData);
    response.end();
  }
}

/**
 * @param port
 */
async function Server(port) {
  Logger.log("Starting website server...");
  const server = require("http").createServer(callback).listen({ port, hostname: "localhost" });

  server.on("close", (...args) => Logger.log(...args));
  server.on("error", e => {
    Logger.err(e.stack);
  });
}

if (require.main == module) {
  Server(5000)
    .then(() => {})
    .catch(error => Logger.err(error.stack));
}

module.exports = Server;
