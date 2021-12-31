const Account = require("hyarcade-requests/types/Account");
const TimSort = require("timsort");
const FileCache = require("../../utils/files/FileCache");
const GenericLeaderboard = require("./GenericLeaderboard");

/**
 * 
 * @param {FileCache} fileCache 
 * @param {string} stat 
 * @param {string} time
 * @returns {Promise<Account[]>}
 */
module.exports = async function generateLeaderboard (fileCache, stat, time) {

  let accounts;

  switch(stat) {
  case "wins" : {
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    break;
  }

  case "kills" : {
    accounts = await GenericLeaderboard("miniWalls", "kills", time, false, false, 300, "hacker", fileCache);
    break;
  }

  case "deaths" : {
    accounts = await GenericLeaderboard("miniWalls", "deaths", time, false, false, 300, "hacker", fileCache);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
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
    accounts = await GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      const top150 = await GenericLeaderboard("miniWalls", "wins", time, false, false, 150, "hacker", fileCache);

      accounts = accounts.filter((acc) => top150.find((a) => a.uuid == acc.uuid) != undefined);
    }
    accounts.map((acc) => {
      acc.miniWalls.ratio = (acc.miniWalls.arrowsHit / acc.miniWalls.arrowsShot) * 100;
      return acc; 
    });

    accounts = accounts.filter((acc) => (acc?.miniWalls?.ratio ?? 0) > 0);

    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.ratio ?? 0) - (a?.miniWalls?.ratio ?? 0));

    break;
  }

  }

  return accounts;

};