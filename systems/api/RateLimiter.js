const { DupeKeyError } = require("hyarcade-errors");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const cfg = require("hyarcade-config").fromJSON();

const endpointValues = {
  undefined: 1,
  account: 1,
  acc: 1,
  leaderboard: 3,
  lb: 3,
  guildleaderboard: 3,
  db: 10,
  database: 10,
  mwlb: 5,
  miniwalls: 5,
  status: 3,
  timeacc: 1,
  timeaccount: 1,
  acctimed: 1,
  gamecounts: 1,
  friends: 2,
  achievements: 2,
  info: 0,
  ping: 0,
  hypixelresource: 0,
  disc: 5,
  guild: 4,
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
 * @param {MongoConnector} mongo
 * @returns {Promise<number>}
 */
async function RateLimiter(address, endpoint, key, pass, mongo) {
  if (pass == cfg.database.pass) {
    return 0;
  }

  const client = await mongo.getRequester(address);
  if (client != undefined) {
    let limit = cfg.database.defaultLimit;
    if (client.key) {
      limit = cfg.database.keys[client.key]?.limit ?? cfg.database.defaultLimit;
    }

    if (Date.now() - client.firstCall > 60000) {
      client.recentRequests = 0;
      client.key = key;
      client.firstCall = Date.now();
    }

    if (client.recentRequests > limit) {
      client.recentRequests += endpointValues[endpoint];
      return Math.max(-(Date.now() - client.firstCall - 60000), 0);
    }

    client.recentRequests += endpointValues[endpoint];

    await mongo.updateRequester(client);
    return 0;
  } else {
    const emptyClient = new clientData();
    emptyClient.firstCall = Date.now();
    emptyClient.address = address;
    emptyClient.recentRequests = endpointValues[endpoint];

    if (key) {
      if (await mongo.requesterKeyInUse(key)) {
        throw new DupeKeyError("Duplicate Key used");
      }

      emptyClient.key = key;
    }

    await mongo.updateRequester(emptyClient);
    return 0;
  }
}

module.exports = RateLimiter;
