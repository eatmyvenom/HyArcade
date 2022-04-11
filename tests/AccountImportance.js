const Logger = require("@hyarcade/logger");
const connector = require("@hyarcade/requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector();
  await c.connect(false);

  const i = await c.getImportantAccounts();

  Logger.log(i.length);
  await c.destroy();
  process.exit(0);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
