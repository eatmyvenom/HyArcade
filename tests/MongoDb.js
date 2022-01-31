const Logger = require("hyarcade-logger");
const connector = require("hyarcade-requests/MongoConnector");
const Sleep = require("hyarcade-utils/Sleep");

/**
 *
 */
async function main() {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect(false);

  Logger.out("partyGames.wins");
  Logger.out(JSON.stringify(await c.getLeaderboard("partyGames.starsEarned", false, 2), null, 2));
  Logger.out("");
  await Sleep(5000);

  Logger.info("partyGames.starsEarned weekly");
  Logger.out(JSON.stringify(await c.getHistoricalLeaderboard("partyGames.starsEarned", "weekly", false, 2), null, 2));
  Logger.out("");
  await Sleep(5000);

  Logger.info("vnmm acc - ign");
  Logger.out(JSON.stringify(await c.getAccount("vnmm")));
  Logger.out("");
  await Sleep(5000);

  Logger.info("vnmm acc - uuid");
  Logger.out(JSON.stringify(await c.getAccount("92a5199614ac4bd181d1f3c951fb719f")));
  Logger.out("");
  await Sleep(5000);

  Logger.info("vnmm acc - discord");
  Logger.out(JSON.stringify(await c.getAccount("156952208045375488")));
  Logger.out("");

  await c.destroy();
}

main()
  .then(Logger.log)
  .catch(Logger.err);