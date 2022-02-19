const https = require("https");
const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");

/**
 *
 * @param {string} uuid
 * @param {string} key
 * @param {string} address
 * @returns {object}
 */
function requestData(uuid, key, address) {
  return new Promise((resolve, reject) => {
    const url = `https://api.hypixel.net/player?uuid=${uuid}`;

    const reqOptions = {
      family: 4,
      port: 443,
      protocol: "https:",
      timeout: 30000,
      localAddress: address,
      headers: {
        "API-KEY": key,
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

/**
 *
 * @param {string} key
 * @param {string} address
 */
async function LocalWorker(key, address) {
  Logger.name = `Worker-${address}`;

  while (await Database.info()) {
    const batchUUIDs = await Database.internal({ getBatch: true });
    for (const uuid of batchUUIDs) {
      try {
        const data = await requestData(uuid, key, address);
        const acc = new Account("", 0, uuid);
        acc.setHypixel(data);
      } catch (error) {
        Logger.error("Error requesting data from local worker.");
        Logger.error(error.stack);
      }
    }
  }
}

module.exports = LocalWorker;
