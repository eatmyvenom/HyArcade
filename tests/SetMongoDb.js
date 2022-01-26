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

  const res = await c.accounts.deleteMany();
  Logger.log("Deleted " + res.deletedCount + " documents");

  await c.destroy();
}

main()
  .then(Logger.log)
  .catch(Logger.err);