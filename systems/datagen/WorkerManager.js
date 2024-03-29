const Logger = require("@hyarcade/logger");
const Database = require("@hyarcade/database");
const Sleep = require("@hyarcade/utils/Sleep");
const LocalWorker = require("./Worker/LocalWorker");
const cfg = require("@hyarcade/config").fromJSON();

/**
 */
async function WorkerManager() {
  Logger.name = "DataGen";
  Logger.emoji = "📈";
  Logger.info("Worker manager started");
  const keys = cfg.hypixel.batchKeys;
  const interfaces = cfg.hypixel.localInterfaces;
  const len = Math.min(keys.length, interfaces.length);

  let ping = await Database.ping();
  Logger.debug("Database ping successful");
  Logger.info(`Initializing ${len} workers.`);

  while (ping) {
    const workers = [];
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      const netIP = interfaces[i];
      const batchRes = await Database.internal({ getBatch: true });

      workers.push(LocalWorker(batchRes, key, netIP));
    }

    Logger.log("Starting batches");
    await Promise.all(workers);
    ping = await Database.ping();

    for (let i = 0; i < 10 && ping == false; i++) {
      Logger.debug("Ping unsuccessful, waiting...");
      await Sleep(30000);
      ping = await Database.ping();
    }
  }
}

if (require.main == module) {
  WorkerManager()
    .then(() => {})
    .catch(error => Logger.err(error.stack));
}

module.exports = WorkerManager;
