const fs = require("fs-extra");
const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const miniUpdater = require("../datagen/miniUpdater");

/**
 *
 */
async function main() {
  let forceLevel = 2;

  try {
    const fileData = await fs.readFile("force");
    forceLevel = fileData.toString() == "" ? 2 : Number(fileData.toString());
  } catch {
    forceLevel = 0;
  }

  const connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect(false);

  const accArr = await connector.getImportantAccounts(forceLevel);
  const uuids = accArr.map(a => a.uuid);

  Logger.info(`Preparing to update ${uuids.length} accounts`);

  await miniUpdater(uuids, connector);

  try {
    await fs.rm("force");
  } catch {
    Logger.info("Was not forced, not removing file");
  }
}

module.exports = main;
