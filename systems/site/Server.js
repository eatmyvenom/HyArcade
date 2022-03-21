const fs = require("fs-extra");
const http = require("http");
const Logger = require("hyarcade-logger");
const { Database } = require("hyarcade-requests");
const GetAsset = require("hyarcade-utils/FileHandling/GetAsset");
const cfg = require("hyarcade-config").fromJSON();
const Handlebars = require("handlebars");

let context;

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
 * @param urlPath
 * @param response
 */
async function handleAssets(urlPath, response) {
  if (fs.existsSync(GetAsset(`site/images/${urlPath[2]}`))) {
    const replyData = await fs.readFile(GetAsset(`site/images/${urlPath[2]}`));
    response.write(replyData);
    response.end();
    return;
  } else {
    Logger.info(urlPath[2]);
    response.statusCode = 403;
    response.end();
    return;
  }
}

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
async function callback(request, response) {
  if (context == undefined) {
    context = {};

    const head = await fs.readFile("include/head.html");
    const footer = await fs.readFile("include/footer.html");

    context.head = head.toString();
    context.footer = footer.toString();
  }

  const url = new URL(request.url, `https://${request.headers.host}`);
  const endpoint = url.pathname.toLowerCase();
  const urlPath = endpoint.split("/");

  let replyData = "";

  Database.internal({ usePage: { endpoint } })
    .then(() => {})
    .catch(error => Logger.error(error));

  if (request.method == "GET") {
    if (endpoint == "/") {
      replyData = await fs.readFile("html/hub.handlebars");
    } else if (urlPath[urlPath.length - 1].endsWith(".js") || (urlPath[urlPath.length - 1].endsWith(".css") && urlPath.length < 4)) {
      if (fs.existsSync(`html/${urlPath[urlPath.length - 1]}`)) {
        replyData = await fs.readFile(`html/${urlPath[urlPath.length - 1]}`);
      } else {
        Logger.info(urlPath.length - 1);
        response.statusCode = 403;
        response.end();
        return;
      }
    } else if (urlPath[1] == "guilds") {
      replyData = await fs.readFile("html/guild.handlebars");
    } else if (urlPath[1] == "assets") {
      return await handleAssets(urlPath, response);
    } else if (pages.has(endpoint.slice(1))) {
      replyData = await fs.readFile("html/generic.handlebars");
    } else if (urlPath[1] == "player") {
      replyData = await fs.readFile("html/player.handlebars");
    } else if (urlPath[1] == "guildstats") {
      replyData = await fs.readFile("html/guildstats.handlebars");
    } else {
      switch (endpoint) {
        case "/github": {
          response.writeHead(302, {
            Location: "https://github.com/eatmyvenom/hyarcade",
          });
          response.end();
          return;
        }

        case "/invite": {
          response.writeHead(302, {
            Location: cfg.discordBot.invite,
          });
          response.end();
          return;
        }

        default: {
          Logger.warn(`${endpoint} redirected to home (${request.headers["x-real-ip"]})`);
          replyData = await fs.readFile("html/hub.handlebars");
        }
      }
    }

    const template = Handlebars.compile(replyData.toString());
    const page = template(context);

    response.write(page);
    response.end();
  }
}

/**
 * @param port
 */
async function Server(port) {
  Logger.name = "Site";
  Logger.emoji = "🌐";
  Logger.log(`Starting website server on port ${port}`);
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
