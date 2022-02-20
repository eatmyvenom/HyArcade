const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const { Account } = require("hyarcade-structures");
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
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = ((acc?.miniWalls?.kills ?? 0) + (acc?.miniWalls?.finalKills ?? 0)) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.kills -= acc.historicalData[0]?.miniWalls?.kills ?? 0;
          acc.miniWalls.finalKills -= acc.historicalData[0]?.miniWalls?.finalKills ?? 0;
          acc.miniWalls.deaths -= acc.historicalData[0]?.miniWalls?.deaths ?? 0;

          acc.miniWalls.ratio = ((acc?.miniWalls?.kills ?? 0) + (acc?.miniWalls?.finalKills ?? 0)) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "kdnf": {
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = (acc?.miniWalls?.kills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.kills -= acc.historicalData[0]?.miniWalls?.kills ?? 0;
          acc.miniWalls.deaths -= acc.historicalData[0]?.miniWalls?.deaths ?? 0;

          acc.miniWalls.ratio = (acc?.miniWalls?.kills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "fd": {
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = (acc?.miniWalls?.finalKills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.finalKills -= acc.historicalData[0]?.miniWalls?.finalKills ?? 0;
          acc.miniWalls.deaths -= acc.historicalData[0]?.miniWalls?.deaths ?? 0;

          acc.miniWalls.ratio = (acc?.miniWalls?.finalKills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "wdd": {
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = (acc?.miniWalls?.witherDamage ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.witherDamage -= acc.historicalData[0]?.miniWalls?.witherDamage ?? 0;
          acc.miniWalls.deaths -= acc.historicalData[0]?.miniWalls?.deaths ?? 0;

          acc.miniWalls.ratio = (acc?.miniWalls?.witherDamage ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "wkd": {
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = (acc?.miniWalls?.witherKills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.witherKills -= acc.historicalData[0]?.miniWalls?.witherKills ?? 0;
          acc.miniWalls.deaths -= acc.historicalData[0]?.miniWalls?.deaths ?? 0;

          acc.miniWalls.ratio = (acc?.miniWalls?.witherKills ?? 0) / (acc?.miniWalls?.deaths ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }

    case "aa": {
      accounts = await getLb("miniWalls", "wins", time, 1500, connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
        accounts.map(acc => {
          acc.miniWalls.ratio = (acc?.miniWalls?.arrowsHit ?? 0) / (acc?.miniWalls?.arrowsShot ?? 0);
          return acc;
        });
      } else {
        const top150 = await getLb("miniWalls", "wins", undefined, 150, connector);

        accounts = accounts.filter(acc => top150.some(a => a.uuid == acc.uuid));

        accounts.map(acc => {
          acc.miniWalls.arrowsShot -= acc.historicalData[0]?.miniWalls?.arrowsShot ?? 0;
          acc.miniWalls.arrowsHit -= acc.historicalData[0]?.miniWalls?.arrowsHit ?? 0;

          acc.miniWalls.ratio = (acc?.miniWalls?.arrowsHit ?? 0) / (acc?.miniWalls?.arrowsShot ?? 0);
          return acc;
        });
      }

      accounts = accounts.filter(acc => (acc?.miniWalls?.ratio ?? 0) > 0);
      TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

      break;
    }
  }

  const hackerArr = await connector.hackerList.find().toArray();
  let hackers = new Set(hackerArr.map(h => h.uuid));

  return accounts.filter(a => !hackers.has(a.uuid));
};
