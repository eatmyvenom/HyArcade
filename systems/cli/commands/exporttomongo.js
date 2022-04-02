const MongoConnector = require("@hyarcade/requests/MongoConnector");
const Accounts = require("@hyarcade/utils/FileHandling/AccountArray");

/**
 *
 */
async function main() {
  const connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect(false);

  const DailyProcessor = new Accounts(`data/accounts.day`);
  const dailyAccounts = await DailyProcessor.readAccounts();

  await connector.updateDaily(dailyAccounts);
}

module.exports = main;
