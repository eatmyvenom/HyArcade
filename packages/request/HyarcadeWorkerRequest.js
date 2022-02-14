const https = require("https");
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
  return new Promise((resolve, reject) => {
    const url = `https://hyarcade-worker.vnmm.workers.dev?pass=${cfg.database.pass}`;

    const reqOptions = {
      family: 4,
      port: 443,
      protocol: "https:",
      timeout: 30000,
      headers: {
        apikey: getAPIKey(),
        accs,
      },
    };

    try {
      const requester = https.get(url, reqOptions, res => {
        let reply = "";
        res.on("data", d => {
          reply += d;
        });
        res.on("end", () => {
          let response;

          try {
            response = JSON.parse(reply);
          } catch (error) {
            reject(error);
          }

          resolve(response);
        });
        res.on("error", reject);
      });

      requester.on("timeout", reject);
      requester.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = HyarcadeWorkerRequest;
