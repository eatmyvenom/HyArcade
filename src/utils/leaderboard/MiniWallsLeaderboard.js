const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const Account = require("hyarcade-requests/types/Account");
const TimSort = require("timsort");

/**
 * @param category
 * @param stat
 * @param timePeriod
 * @param max
 * @param {MongoConnector} connector
 * @returns {Promise<Account>}
 */
async function getLb(category, stat, timePeriod, max, connector) {
  Logger.verbose("Getting leaderboard");
  const dotNotated = `${category ?? ""}.${stat}`.replace(/^\./, "").replace(/\.\./g, ".");

  const accs = await (timePeriod == undefined || timePeriod == "life" || timePeriod == "lifetime" || timePeriod == undefined || timePeriod == ""
    ? connector.getMiniWallsLeaderboard(dotNotated, max)
    : connector.getHistoricalMiniWallsLeaderboard(dotNotated, timePeriod, max));

  return accs;
}

/**
 *
 * @param {MongoConnector} connector
 * @param {string} stat
 * @param {string} time
 * @returns {Promise<Account[]>}
 */
module.exports = async function generateLeaderboard(connector, stat, time) {
  let accounts;

  switch (stat) {
    case "wins": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      break;
    }

    case "kills": {
      accounts = await getLb("miniWalls", "kills", time, 300, connector);
      break;
    }

    case "deaths": {
      accounts = await getLb("miniWalls", "deaths", time, 300, connector);
      break;
    }

    case "witherDamage": {
      accounts = await getLb("miniWalls", "witherDamage", time, 300, connector);
      break;
    }

    case "witherKills": {
      accounts = await getLb("miniWalls", "witherKills", time, 300, connector);
      break;
    }

    case "finalKills": {
      accounts = await getLb("miniWalls", "finalKills", time, 300, connector);
      break;
    }

    case "arrowsShot": {
      accounts = await getLb("miniWalls", "arrowsShot", time, 300, connector);
      break;
    }

    case "arrowsHit": {
      accounts = await getLb("miniWalls", "arrowsHit", time, 300, connector);
      break;
    }

    case "kd": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = ((acc?.miniWalls?.kills ?? 0) + (acc?.miniWalls?.finalKills ?? 0)) / (acc?.miniWalls?.deaths ?? 0);
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "kdnf": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = acc.miniWalls.kills / acc.miniWalls.deaths;
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);

      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "fd": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = acc.miniWalls.finalKills / acc.miniWalls.deaths;
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);

      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));
      break;
    }

    case "wdd": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = acc.miniWalls.witherDamage / acc.miniWalls.deaths;
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);

      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "wkd": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = acc.miniWalls.witherKills / acc.miniWalls.deaths;
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);

      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "aa": {
      accounts = await getLb("miniWalls", "wins", time, 300, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await getLb("miniWalls", "wins", time, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));
      }
      accounts.map(acc => {
        acc.miniWalls.ratio = (acc.miniWalls.arrowsHit / acc.miniWalls.arrowsShot) * 100;
        return acc;
      });

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);

      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }
  }

  const hackerArr = await connector.hackerList.find().toArray();
  let hackers = new Set(hackerArr.map(h => h.uuid));

  return accounts.filter(a => !hackers.has(a.uuid));
};
