const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const connector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect();

  const accs = await Database.readDB("accounts");
  await c.setAccounts(accs);
}

main()
  .then(Logger.log)
  .catch(Logger.err);