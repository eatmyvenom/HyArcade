const Account = require("hyarcade-requests/types/Account");
const TimSort = require("timsort");
const AccountArray = require("../../request/types/AccountArray");
const FileCache = require("../../utils/files/FileCache");

/**
 * 
 * @param {FileCache} fileCache 
 * @param {string} stat 
 * @param {string} time
 * @returns {Promise<Account[]>}
 */
async function generateLeaderboard (fileCache, stat, time) {
  /** @type {Account[]} */
  let accounts = new AccountArray(JSON.parse(JSON.stringify(fileCache.accounts)));

  accounts = accounts.filter((acc) => (acc?.miniWalls?.kills ?? 0) > 0);
  accounts = accounts.filter((a) => !fileCache.hackerlist.includes(a?.uuid?.toLowerCase()));

  if(time != undefined) {

    /** @type {Account[]} */
    const timedAccounts = new AccountArray(JSON.parse(JSON.stringify(fileCache[`${time}accounts`])));

    accounts.map((acc) => {
      const timeAcc = timedAccounts.find((a) => a.uuid == acc.uuid);

      acc.miniWalls.wins -= timeAcc?.miniWalls?.wins ?? acc.miniWalls.wins;
      acc.miniWalls.arrowsHit -= timeAcc?.miniWalls?.arrowsHit ?? acc.miniWalls.arrowsHit;
      acc.miniWalls.arrowsShot -= timeAcc?.miniWalls?.arrowsShot ?? acc.miniWalls.arrowsShot;
      acc.miniWalls.deaths -= timeAcc?.miniWalls?.deaths ?? acc.miniWalls.deaths;
      acc.miniWalls.finalKills -= timeAcc?.miniWalls?.finalKills ?? acc.miniWalls.finalKills;
      acc.miniWalls.kills -= timeAcc?.miniWalls?.kills ?? acc.miniWalls.kills;
      acc.miniWalls.witherDamage -= timeAcc?.miniWalls?.witherDamage ?? acc.miniWalls.witherDamage;
      acc.miniWalls.witherKills -= timeAcc?.miniWalls?.witherKills ?? acc.miniWalls.witherKills;

      return acc;
    });
  }

  accounts = accounts.filter((acc) => (acc?.miniWalls?.kills ?? 0) > 0);

  switch(stat) {
  case "wins" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.wins ?? 0) > 0);
    break;
  }

  case "kills" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.kills ?? 0) - (a?.miniWalls?.kills ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.kills ?? 0) > 0);
    break;
  }

  case "deaths" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.deaths ?? 0) - (a?.miniWalls?.deaths ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.deaths ?? 0) > 0);
    break;
  }

  case "witherDamage" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.witherDamage ?? 0) - (a?.miniWalls?.witherDamage ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.witherDamage ?? 0) > 0);
    break;
  }

  case "witherKills" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.witherKills ?? 0) - (a?.miniWalls?.witherKills ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.witherKills ?? 0) > 0);
    break;
  }

  case "finalKills" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.finalKills ?? 0) - (a?.miniWalls?.finalKills ?? 0));

    accounts = accounts.filter((acc) => (acc?.miniWalls?.finalKills ?? 0) > 0);
    break;
  }

  case "kd" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWallsWins ?? 0) - (a?.miniWallsWins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = ((acc?.miniWalls?.kills ?? 0) + (acc?.miniWalls?.finalKills ?? 0)) / (acc?.miniWalls?.deaths ?? 0);
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  case "kdnf" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = acc.miniWalls.kills / acc.miniWalls.deaths;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  case "fd" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = acc.miniWalls.finalKills / acc.miniWalls.deaths;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));
    break;
  }

  case "wdd" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = acc.miniWalls.witherDamage / acc.miniWalls.deaths;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  case "wkd" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = acc.miniWalls.witherKills / acc.miniWalls.deaths;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  case "aa" : {
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time != undefined) {
      accounts = accounts.slice(0, 150);
    } else {
      accounts = accounts.slice(0, 25);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = acc.miniWalls.arrowsHit / acc.miniWalls.arrowsShot;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  }

  return accounts.map((acc) => {
    for(const stat in acc) {
      if(stat != "miniWalls" && stat != "rank" && stat != "uuid" && stat != "name") {
        delete acc[stat];
      }
    }

    return acc;
  });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const stat = url.searchParams.get("stat");
  const time = url.searchParams.get("time");
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const leaderboard = JSON.stringify(await generateLeaderboard(fileCache, stat, time));

    res.write(leaderboard);
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
