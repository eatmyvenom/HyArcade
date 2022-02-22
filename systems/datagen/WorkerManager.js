const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const LocalWorker = require("./Worker/LocalWorker");
const cfg = require("hyarcade-config").fromJSON();

/**
 */
async function WorkerManager() {
  Logger.name = "Data-Generator";
  Logger.emoji = "📈";
  const keys = cfg.hypixel.batchKeys;
  const interfaces = cfg.hypixel.localInterfaces;
  const len = Math.min(keys.length, interfaces.length);

  let ping = await Database.ping();
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
  }
}

module.exports = WorkerManager;