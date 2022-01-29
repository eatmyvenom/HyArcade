const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const connector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect();

  const dayAccs = await Database.readDB("dayaccounts");
  await c.updateDaily(dayAccs);
  
  const weekAccs = await Database.readDB("weeklyaccounts");
  await c.updateWeekly(weekAccs);

  const monthAccs = await Database.readDB("monthlyaccounts");
  await c.updateMonthly(monthAccs);

  await c.destroy();
}

main()
  .then(Logger.log)
  .catch(Logger.err);