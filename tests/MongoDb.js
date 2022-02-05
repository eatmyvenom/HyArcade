const Logger = require("hyarcade-logger");
const connector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect(false);

  Logger.debug(c.guilds.collectionName);
  Logger.debug(await c.guilds.countDocuments());
  Logger.debug(c.guilds.isCapped);
  Logger.debug(JSON.stringify(await c.guilds.stats()));
}

main().then(Logger.log).catch(Logger.err);
