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
    accounts = GenericLeaderboard("miniWalls", "wins", time, false, false, 300, "hacker", fileCache);
    break;
  }

  case "kills" : {
    accounts = GenericLeaderboard("miniWalls", "kills", time, false, false, 300, "hacker", fileCache);
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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls.wins ?? 0) - (a?.miniWalls.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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
    TimSort.sort(accounts, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
    if(time == undefined || time == null) {
      accounts = accounts.slice(0, 150);
    } else {
      let top150 = accs;
      TimSort.sort(top150, (a, b) => (b?.miniWalls?.wins ?? 0) - (a?.miniWalls?.wins ?? 0));
      top150 = top150.slice(0, 150);

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

  return accounts.map((acc) => {
    for(const stat in acc) {
      if(stat != "miniWalls" && stat != "rank" && stat != "uuid" && stat != "name" && stat != "plusColor" && !stat.toLowerCase().includes("guild")) {
        delete acc[stat];
      }
    }

    return acc;
  });

};