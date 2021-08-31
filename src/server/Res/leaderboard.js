const TimSort = require("timsort");
const FileCache = require("../../utils/files/FileCache");

/**
 * @param {string} str
 * @returns {number}
 */
function numberify (str) {
  const cleanStr = str ?? 0;
  return Number(cleanStr);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {FileCache} fileCache 
 */
module.exports = async (req, res, fileCache) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const lbprop = url.searchParams.get("path");
  const category = url.searchParams.get("category");
  const timePeriod = url.searchParams.get("time");
  const min = url.searchParams.has("min");
  if(req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    // Full copy to prevent accounts list from being messed up
    let accounts = JSON.parse(JSON.stringify(fileCache.accounts));

    if(timePeriod == undefined) {
      if(category == null) {
        TimSort.sort(accounts, (b, a) => numberify(a?.[lbprop] ?? 0) - numberify(b?.[lbprop] ?? 0));
      } else {
        TimSort.sort(accounts, (b, a) => numberify(a?.[category]?.[lbprop] ?? 0) - numberify(b?.[category]?.[lbprop] ?? 0));
      }
    } else {
      const newAcclist = [];
      const oldCopy = JSON.parse(JSON.stringify(fileCache[`${timePeriod}accounts`]));
      for(const a of oldCopy) {
        const n = fileCache.accounts.find((u) => u.uuid == a.uuid);
        if(category == null) {
          a[lbprop] = numberify(n[lbprop] - a[lbprop]);
          a.name = n?.name ?? "INVALID-NAME";
          newAcclist.push(a);
        } else {
          if(a[category] != undefined) {
            a[category][lbprop] = numberify(n?.[category]?.[lbprop]) - numberify(a?.[category]?.[lbprop]);
            a.name = n?.name ?? "INVALID-NAME";
            newAcclist.push(a);
          } else {
            a[category] = {};
            a[category][lbprop] = numberify(n?.[category]?.[lbprop]) - numberify(a?.[category]?.[lbprop]);
            a.name = n?.name ?? "INVALID-NAME";
            newAcclist.push(a);
          }
        }
      }
      accounts = newAcclist;
      if(category == null) {
        TimSort.sort(accounts, (b, a) => numberify(a?.[lbprop] ?? 0) - numberify(b?.[lbprop] ?? 0));
      } else {
        TimSort.sort(accounts, (b, a) => numberify(a?.[category]?.[lbprop] ?? 0) - numberify(b?.[category]?.[lbprop] ?? 0));
      }
    }

    if(min) {
      if(category == null) {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != lbprop && key != "name" && key != "uuid") {
              delete a[key];
            }
          }
        });
      } else {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != category && key != "name" && key != "uuid") {
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

    accounts = accounts.slice(0, Math.min(accounts.length, 300));

    res.write(JSON.stringify(accounts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
