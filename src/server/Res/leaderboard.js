const Account = require("hyarcade-requests/types/Account");
const AccountArray = require("hyarcade-requests/types/AccountArray");
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
  const max = url.searchParams.get("max") ?? 300;

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
    let accounts = AccountArray([...fileCache.accounts]);

    if(timePeriod == undefined) {
      TimSort.sort(accounts, (b, a) => numberify(getter(a)) - numberify(getter(b)));
    } else {
      const newAccs = [];
      const old = fileCache[`indexed${timePeriod}`];
      const retro = fileCache.retro[`${timePeriod}accounts`];

      for(const a of accounts) {
        const o = old[a.uuid];

        if(a.name == "INVALID-NAME" || a.nameHist.includes("INVALID-NAME")) {
          newAccs.push(new Account(a.name, 0, a.uuid));
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
        newAccs.push(a);
      }

      accounts = newAccs;
      if(reverse) {
        TimSort.sort(accounts, (a, b) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
      } else {
        TimSort.sort(accounts, (b, a) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
      }
    }

    accounts = accounts.slice(0, Math.min(accounts.length, max));

    if(min) {
      if(category == null) {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != lbprop && key != "name" && key != "lbProp" && key != "uuid" && key != "rank" && key != "plusColor" && key != "mvpColor") {
              delete a[key];
            }
          }
        });
      } else {
        accounts.forEach((a) => {
          for(const key in a) {
            if(key != category && key != "name" && key != "lbProp" && key != "uuid" && key != "rank" && key != "plusColor" && key != "mvpColor") {
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

    res.write(JSON.stringify(accounts));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
