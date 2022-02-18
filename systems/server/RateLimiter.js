const Logger = require("hyarcade-logger");
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
  guild: 5,
  hacker: 5,
  banned: 5,
};

class clientData {
  recentRequests = 0;
  address = "";
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
    if (key) {
      limit = cfg.database.keys[key];
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

    clients.push(emptyClient);
    return 0;
  }
}

module.exports = RateLimiter;
