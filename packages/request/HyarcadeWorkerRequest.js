const { default: axios } = require("axios");
const cfg = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const keys = [...cfg.hypixel.batchKeys, cfg.clusters[cfg.cluster].key];

let currentKey = 0;

/**
 *
 * @returns {string}
 */
function getAPIKey() {
  const key = keys[currentKey];
  currentKey += 1;
  if (currentKey == keys.length) {
    currentKey = 0;
  }

  logger.verbose(`Using key : ${currentKey + 1} of ${keys.length} (${currentKey.toString().slice(0, 16)})`);

  return key;
}

class Response {
  key = {};
  data = [];
}

/**
 *
 * @param {string[]} accs
 * @returns {Promise<Response>}
 */
async function HyarcadeWorkerRequest(accs) {
  return axios.get(`https://hyarcade-worker.vnmm.workers.dev?pass=${cfg.database.pass}`, { headers: { apikey: getAPIKey(), accs } });
}

module.exports = HyarcadeWorkerRequest;
