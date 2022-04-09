const https = require("https");
const { LoggerInstance } = require("@hyarcade/logger");
const Logger = new LoggerInstance("Worker", "📈");
const Database = require("@hyarcade/database");
const { Account } = require("@hyarcade/structures");
const Sleep = require("@hyarcade/utils/Sleep");
const cfg = require("@hyarcade/config").fromJSON();
const { RequestTimeoutError, HypixelResponseError } = require("@hyarcade/errors");

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
      timeout: cfg.hypixel.datagen.hypixelReqTimeout,
      localAddress: address,
      headers: {
        "API-KEY": key,
      },
    };

    try {
      const requester = https.get(url, reqOptions, res => {
        if (res.statusCode > 500) {
          reject(new HypixelResponseError("Hypixel Encountered an error", res.statusCode));
          res.destroy();
          return;
        } else if (res.statusCode == 403) {
          reject(new Error("API KEY REJECTED!"));
          res.destroy();
          return;
        }

        let reply = "";
        res.on("data", d => {
          reply += d;
        });
        res.on("end", () => {
          let response;

          try {
            response = JSON.parse(reply);
          } catch (error) {
            Logger.error("Error parsing hypixel response.");
            reject(error);
          }

          resolve({ data: response, headers: res.headers });
        });
        res.on("error", reject);
      });

      requester.on("timeout", () => {
        reject(new RequestTimeoutError("The outgoing request timed out."));
      });
      requester.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *
 * @param uuid
 * @param key
 * @param address
 */
async function getAccount(uuid, key, address) {
  try {
    let reply = await requestData(uuid, key, address);
    while (reply.headers["retry-after"]) {
      Logger.verbose(`Rate limit hit, retrying after ${reply.headers["retry-after"]} seconds`);
      await Sleep(reply.headers["retry-after"] * 1100 + 1000);
      reply = await requestData(uuid, key, address);
    }

    if (reply?.data?.player == undefined) {
      if (cfg.logRateLimit) {
        Logger.warn(`Unable to access data for ${uuid}`);
        Logger.warn(JSON.stringify(reply?.data));
        await Database.DeleteAccount(uuid);
        return { remain: reply.headers["ratelimit-remaining"], reset: reply.headers["ratelimit-reset"] };
      } else {
        Logger.verbose(`Unable to access data for ${uuid}`);
        return { remain: reply.headers["ratelimit-remaining"], reset: reply.headers["ratelimit-reset"] };
      }
    } else {
      const acc = new Account("", 0, uuid);
      acc.setHypixel(reply.data);

      await Database.addAccount(acc);
      return { remain: reply.headers["ratelimit-remaining"], reset: reply.headers["ratelimit-reset"] };
    }
  } catch (error) {
    if (error instanceof HypixelResponseError) {
      Logger.verbose(error);
      return await getAccount(uuid, key, address);
    } else {
      throw error;
    }
  }
}

/**
 *
 * @param {string} batchUUIDs
 * @param {string} key
 * @param {string} address
 */
async function runBatch(batchUUIDs, key, address) {
  await Promise.all(batchUUIDs.map(async uuid => await getAccount(uuid, key, address)));
}

/**
 *
 * @param {object[]} batchRes
 * @param {string} key
 * @param {string} address
 */
async function LocalWorker(batchRes, key, address) {
  Logger.verbose(`${address} - Querying data`);
  const batchUUIDs = batchRes.map(a => a.uuid);
  try {
    await runBatch(batchUUIDs, key, address);
    Logger.verbose(`Batch completed`);
  } catch (error) {
    Logger.error(error);
  }
}

module.exports = LocalWorker;
