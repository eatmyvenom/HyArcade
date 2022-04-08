const Logger = require("@hyarcade/logger");
const Database = require("@hyarcade/database");
const cfg = require("@hyarcade/config").fromJSON();
const https = require("https");

/**
 * @param key
 * @param address
 * @returns {Promise}
 */
function checkKey(key, address) {
  return new Promise((resolve, reject) => {
    const url = `https://api.hypixel.net/key`;

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
        if (res.statusCode > 500) {
          reject(new Error("Hypixel Encountered an error", res.statusCode));
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
        reject(new Error("The outgoing request timed out."));
      });
      requester.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 */
async function main() {
  const keys = cfg.hypixel.batchKeys;
  const interfaces = cfg.hypixel.localInterfaces;
  const len = Math.min(keys.length, interfaces.length);

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    const netIP = interfaces[i];

    const keyData = await checkKey(key, netIP);

    const owner = await Database.account(keyData.data.record.owner);
    const info = { ...keyData.data, ownerName: owner.name, netIP };

    console.log(info);
  }
}

if (require.main == module) {
  main()
    .then(() => {})
    .catch(error => Logger.err(error.stack));
}

module.exports = main;
