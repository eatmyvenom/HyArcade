const MongoConnector = require("hyarcade-requests/MongoConnector");
const Account = require("hyarcade-requests/types/Account");
const TimSort = require("timsort");
const GenericLeaderboard = require("./GenericLeaderboard");

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      break;
    }

    case "kills": {
      accounts = await GenericLeaderboard("miniWalls", "kills", time, false, 300, "hacker", connector);
      break;
    }

    case "deaths": {
      accounts = await GenericLeaderboard("miniWalls", "deaths", time, false, 300, "hacker", connector);
      break;
    }

    case "witherDamage": {
      accounts = await GenericLeaderboard("miniWalls", "witherDamage", time, false, 300, "hacker", connector);
      break;
    }

    case "witherKills": {
      accounts = await GenericLeaderboard("miniWalls", "witherKills", time, false, 300, "hacker", connector);
      break;
    }

    case "finalKills": {
      accounts = await GenericLeaderboard("miniWalls", "finalKills", time, false, 300, "hacker", connector);
      break;
    }

    case "arrowsShot": {
      accounts = await GenericLeaderboard("miniWalls", "arrowsShot", time, false, 300, "hacker", connector);
      break;
    }

    case "arrowsHit": {
      accounts = await GenericLeaderboard("miniWalls", "arrowsHit", time, false, 300, "hacker", connector);
      break;
    }

    case "kd": {
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, 300, "hacker", connector);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, 150, "hacker", connector);

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

  return accounts.filter(a => !connector.hackerlist.includes(a.uuid));
};
