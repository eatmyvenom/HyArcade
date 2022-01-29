const Logger = require("hyarcade-logger");
const connector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect();

  console.dir(await c.getHistoricalLeaderboard("partyGames.starsEarned", "weekly", false, 10));

  await c.destroy();
}

main()
  .then(Logger.log)
  .catch(Logger.err);