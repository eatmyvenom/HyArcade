const fs = require("fs-extra");
const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const miniUpdater = require("../datagen/miniUpdater");

/**
 *
 */
async function main() {
  Logger.name = "Data-Generator";
  Logger.emoji = "📈";
  let forceLevel = 2;

  try {
    const fileData = await fs.readFile("force");
    forceLevel = fileData.toString() == "" ? 2 : Number(fileData.toString());
    await fs.rm("force");
  } catch {
    forceLevel = 0;
  }

  const uuids = await Database.internal({ fetchImportant: forceLevel });

  Logger.info(`Preparing to update ${uuids.length} accounts`);

  await miniUpdater(uuids);
  Logger.info("Update completed!");
}

module.exports = main;
