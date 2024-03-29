const Logger = require("@hyarcade/logger");
const Database = require("@hyarcade/database");
const LocalWorker = require("../../datagen/Worker/LocalWorker");

/**
 * @param {string[]} args
 */
async function main(args) {
  Logger.name = "Worker";

  let ping = await Database.ping();
  while (ping) {
    const batchRes = await Database.internal({ getBatch: true }, args[4]);
    await LocalWorker(batchRes, args[3]);

    Logger.verbose("Batch completed");
    ping = await Database.ping();
  }
}

module.exports = main;
