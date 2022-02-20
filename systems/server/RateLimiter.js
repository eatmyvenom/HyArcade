const Logger = require("hyarcade-logger");
const { DupeKeyError } = require("hyarcade-errors");
const cfg = require("hyarcade-config").fromJSON();

/**
 * @type {clientData[]}
 */
let clients = [];

const endpointValues = {
  undefined: 1,
  account: 1,
  acc: 1,
  leaderboard: 3,
  lb: 3,
  db: 10,
  database: 10,
  mwlb: 5,
  miniwalls: 5,
  timeacc: 1,
  timeaccount: 1,
  acctimed: 1,
  info: 0,
  ping: 0,
  disc: 5,
  guild: 0,
  hacker: 0,
  banned: 0,
  internal: 1,
};

class clientData {
  recentRequests = 0;
  address = "";
  key = "";
  firstCall = 0;
}

/**
 *
 * @param {string} address
 * @param {string} endpoint
 * @param {string} key
 * @param {string} pass
 * @returns {number}
 */
function RateLimiter(address, endpoint, key, pass) {
  if (pass == cfg.database.pass) {
    Logger.verbose("Skipping rate limit with database master pass");
    return 0;
  }

  const client = clients.find(v => v.address == address);
  if (client != undefined) {
    let limit = cfg.database.defaultLimit;
    if (client.key) {
      limit = cfg.database.keys[client.key]?.limit ?? 120;
    }

    if (Date.now() - client.firstCall > 60000) {
      client.recentRequests = 0;
      client.firstCall = Date.now();
    }

    if (client.recentRequests > limit) {
      client.recentRequests += endpointValues[endpoint];
      return Math.max(-(Date.now() - client.firstCall - 60000), 0);
    }

    client.recentRequests += endpointValues[endpoint];
    return 0;
  } else {
    const emptyClient = new clientData();
    emptyClient.firstCall = Date.now();
    emptyClient.address = address;
    emptyClient.recentRequests = endpointValues[endpoint];

    if (key) {
      if (clients.some(c => c.key == key)) {
        throw new DupeKeyError("Duplicate Key used");
      }

      emptyClient.key = key;
    }

    clients.push(emptyClient);
    return 0;
  }
}

module.exports = RateLimiter;
