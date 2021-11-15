const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const TimSort = require("timsort");
const FileCache = require("../../utils/files/FileCache");

/**
 * 
 * @param {*} val 
 * @returns {boolean}
 */
function testNullish (val) {
  if(!(val ?? false)) {
    return false;
  }

  return true;
}

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
  const a = str.split(".");
  for(let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if(k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);

  let category = url.searchParams.get("category");
  const lbprop = url.searchParams.get("path");
  const timePeriod = url.searchParams.get("time");
  const min = url.searchParams.has("min");
  const reverse = url.searchParams.has("reverse");

  if(req.method == "GET") {

    let getter;
    if(lbprop?.startsWith(".")) {
      category = lbprop.split(".")[1];
      getter = (a) => getProp(a, lbprop) ?? 0;
    } else if(category == null) {
      getter = (a) => a?.[lbprop] ?? 0;
    } else {
      getter = (a) => a?.[category]?.[lbprop] ?? 0;
    }

    res.setHeader("Content-Type", "application/json");

    // Full copy to prevent accounts list from being messed up
    let accounts = AccountArray(JSON.parse(JSON.stringify(fileCache.accounts)));

    accounts = accounts.filter((a) => testNullish(getter(a)));

    if(timePeriod == undefined) {
      TimSort.sort(accounts, (b, a) => numberify(getter(a)) - numberify(getter(b)));
    } else {
      const newAcclist = [];
      const oldCopy = JSON.parse(JSON.stringify(fileCache[`${timePeriod}accounts`]));

      for(const a of oldCopy) {
        const n = fileCache.accounts.find((u) => u.uuid === a.uuid);

        if(a.name == "INVALID-NAME" || a.nameHist.includes("INVALID-NAME") || a.timePlaying == 0) {
          newAcclist.push(new Account(a.name, 0, a.uuid));
        }

        a.lbProp = numberify(getter(n)) - numberify(getter(a)) ?? 0;
        a.name = n?.name ?? "INVALID-NAME";
        a.rank = n?.rank;
        a.plusColor = n?.plusColor;
        a.guildTag = n?.guildTag;
        a.guildTagColor = n?.guildTagColor;
        newAcclist.push(a);
      }

      accounts = newAcclist;
      TimSort.sort(accounts, (b, a) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
    }

    if(min) {
      if(category == null) {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != lbprop && key != "name" && key != "lbProp" && key != "uuid" && key != "rank" && key != "plusColor") {
              delete a[key];
            }
          }
        });
      } else {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != category && key != "name" && key != "lbProp" && key != "uuid" && key != "rank" && key != "plusColor") {
              delete a[key];
            }
          }

          for(const key in a?.[category]) {
            if(key != lbprop) {
              delete a[key];
            }
          }
        });
      }
    }

    if(reverse) {
      accounts = accounts.reverse();
    }

    accounts = accounts.slice(0, Math.min(accounts.length, 300));

    res.write(JSON.stringify(accounts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
