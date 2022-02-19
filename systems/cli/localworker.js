const LocalWorker = require("../datagen/LocalWorker");

const cfg = require("hyarcade-config").fromJSON();

/**
 *
 */
async function main() {
  const keys = cfg.hypixel.batchKeys;
  const interfaces = cfg.hypixel.localInterfaces;

  const workers = [];
  const len = Math.min(keys.length, interfaces.length);
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const netIP = interfaces[i];

    workers.push(LocalWorker(key, netIP));
  }

  await Promise.all(workers);
}

module.exports = main;
