/* eslint-disable no-param-reassign */
const TimSort = require("timsort");
const FileCache = require("../../utils/files/FileCache");
const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");

/**
 * @param {string} str
 * @returns {number}
 */
function numberify (str) {
  const cleanStr = str ?? 0;
  return Number(cleanStr);
}

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp (o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const propertyArray = str.split(".");
  for(let i = 0, arrLength = propertyArray.length; i < arrLength; i += 1) {
    const subObject = propertyArray[i];
    if(subObject in obj) {
      obj = obj[subObject];
    } else {
      return;
    }
  }
  return obj;
}

/**
 * 
 * @param {string} category the object to fetch from each account
 * @param {string} lbprop the property to fetch from each account
 * @param {string} timePeriod the time period to get the data from
 * @param {boolean} min whether the data should be minified before sending
 * @param {boolean} reverse whether the leaderboard should be reversed to show lowest values
 * @param {string} max the maximum amount of accounts to return
 * @param {string} filter Stats that if present excludes people from the list, must be top level
 * @param {FileCache} fileCache The file cache containing all account info
 * @returns {Promise<Account[]>} 
 */
module.exports = async function (category, lbprop, timePeriod, min, reverse, max, filter = "", fileCache) {

  Logger.verbose("Getting leaderboard");

  let getter;
  const defaultValue = reverse ? Number.MAX_SAFE_INTEGER : 0;

  if(lbprop?.startsWith(".")) {
    category = lbprop.split(".")[1];
    getter = (a) => getProp(a, lbprop) ?? defaultValue;
  } else if(category == null) {
    getter = (a) => a?.[lbprop] ?? defaultValue;
  } else {
    getter = (a) => a?.[category]?.[lbprop] ?? defaultValue;
  }

  let accs;

  Logger.verbose("Getting accounts");
  if(timePeriod == undefined || timePeriod == "life" || timePeriod == "lifetime" || timePeriod == null || timePeriod == "") {
    Logger.verbose("Using normal leaderboard");
    accs = Object.values(fileCache.indexedAccounts);

    Logger.verbose("Sorting accounts");
    TimSort.sort(accs, (b, a) => numberify(getter(a)) - numberify(getter(b)));

    if(reverse) {
      Logger.verbose("reversing");
      accs = accs.reverse();
    }
  } else {
    accs = Object.values(fileCache.indexedAccounts);
    const old = fileCache[`indexed${timePeriod}`];
    const retro = fileCache.retro[`${timePeriod}accounts`];

    for(const a of accs) {
      const o = old[a.uuid];

      if(a.name == "INVALID-NAME" || a.nameHist.includes("INVALID-NAME")) {
        a.lbProp = 0;
        continue;
      }

      let oldval = 0;
      if(o == undefined) {
        const rAcc = retro?.[a.uuid];

        if(rAcc == undefined) {
          oldval = numberify(getter(a));
        } else {
          oldval = numberify(getter(rAcc));
        }
      } else {
        oldval = numberify(getter(o));
      }

      a.lbProp = numberify(getter(a)) - (oldval);
    }

    if(reverse) {
      TimSort.sort(accs, (a, b) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
    } else {
      TimSort.sort(accs, (b, a) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
    }
  }

  if(filter != "" && filter != undefined && filter != null) {
    accs = accs.filter((a) => {
      for(const prop of filter.split(",")) {
        if(a[prop]) return false;
      }
  
      return true;
    });
  }


  const maxSize = Math.min(accs.length, max);
  accs = accs.slice(0, maxSize);
  Logger.verbose("Leaderboard generated!");

  return accs;
};
