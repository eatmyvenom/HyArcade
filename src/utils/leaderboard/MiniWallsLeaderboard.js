const Account = require("hyarcade-requests/types/Account");
const FileCache = require("hyarcade-utils/FileHandling/FileCache");
const TimSort = require("timsort");
const GenericLeaderboard = require("./GenericLeaderboard");

/**
 *
 * @param {FileCache} fileCache
 * @param {string} stat
 * @param {string} time
 * @returns {Promise<Account[]>}
 */
module.exports = async function generateLeaderboard(fileCache, stat, time) {
  let accounts;

  switch (stat) {
    case "wins": {
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "kills": {
      accounts = await GenericLeaderboard("miniWalls", "kills", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "deaths": {
      accounts = await GenericLeaderboard("miniWalls", "deaths", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "witherDamage": {
      accounts = await GenericLeaderboard("miniWalls", "witherDamage", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "witherKills": {
      accounts = await GenericLeaderboard("miniWalls", "witherKills", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "finalKills": {
      accounts = await GenericLeaderboard("miniWalls", "finalKills", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "arrowsShot": {
      accounts = await GenericLeaderboard("miniWalls", "arrowsShot", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "arrowsHit": {
      accounts = await GenericLeaderboard("miniWalls", "arrowsHit", time, false, false, 300, "hacker", fileCache);
      break;
    }

    case "kd": {
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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
      accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
      if (time == undefined || time == undefined) {
        accounts = accounts.slice(0, 150);
      } else {
        const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

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

  return accounts.filter(a => !fileCache.hackerlist.includes(a.uuid));
};
