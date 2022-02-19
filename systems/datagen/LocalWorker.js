const https = require("https");
const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");
const Sleep = require("hyarcade-utils/Sleep");
const cfg = require("hyarcade-config").fromJSON();

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

          resolve({ data: response, headers: res.headers });
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
 * @param {string} batchUUIDs
 * @param {string} key
 * @param {string} address
 */
async function runBatch(batchUUIDs, key, address) {
  for (const uuid of batchUUIDs) {
    try {
      let reply = await requestData(uuid, key, address);
      while (reply.headers["retry-after"]) {
        if (cfg.logRateLimit) {
          Logger.warn(`Rate limit hit, retrying after ${reply.headers["retry-after"]} seconds`);
        }
        await Sleep(reply.headers["retry-after"] * 1001);
        reply = await requestData(uuid, key, address);
      }

      if (reply?.data?.player == undefined) {
        if (cfg.logRateLimit) {
          Logger.warn(`Unable to access data for ${uuid}`);
          Logger.warn(reply?.data);
        } else {
          Logger.verbose(`Unable to access data for ${uuid}`);
        }
      }

      const acc = new Account("", 0, uuid);
      acc.setHypixel(reply.data);

      await Database.addAccount(acc);
    } catch (error) {
      Logger.error("Error requesting data from local worker.");
      Logger.error(error.stack);
    }
  }
}

/**
 *
 * @param {string} key
 * @param {string} address
 */
async function LocalWorker(key, address) {
  Logger.name = `Worker-${address}`;

  let lastInfo = await Database.info();

  while (lastInfo != undefined) {
    Logger.info("Starting batch");
    const batchRes = await Database.internal({ getBatch: true });
    const batchUUIDs = batchRes.map(a => a.uuid);
    await runBatch(batchUUIDs, key, address);
    Logger.info("Batch completed");

    lastInfo = await Database.info();
  }
}

module.exports = LocalWorker;
