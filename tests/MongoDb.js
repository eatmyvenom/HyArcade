const Logger = require("@hyarcade/logger");
const connector = require("@hyarcade/requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector();
  await c.connect(false);

  Logger.debug(c.guilds.collectionName);
  Logger.debug(await c.guilds.countDocuments());
  Logger.debug(await c.guilds.isCapped());
  Logger.debug(c.guilds.writeConcern);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
