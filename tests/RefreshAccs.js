const connector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect(false);

  const accs = await c.getImportantAccounts();
  console.log(accs);

  await c.destroy();
}

main()
  .then(() => {})
  .catch(() => {});
