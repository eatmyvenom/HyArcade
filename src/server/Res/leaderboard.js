const Account = require("hyarcade-requests/types/Account");
const TimSort = require("timsort");
const FileCache = require("../../utils/files/FileCache");
const { Readable, pipeline } = require("stream");
const zlib = require("zlib");
const Logger = require("hyarcade-logger");

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
  const max = url.searchParams.get("max") ?? 200;

  if(req.method == "GET") {
    Logger.verbose("Getting leaderboard");
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

    Logger.verbose("Copying accs");
    let accs = fileCache.accounts;

    Logger.verbose("Sorting accounts");
    if(timePeriod == undefined) {
      TimSort.sort(accs, (b, a) => numberify(getter(a)) - numberify(getter(b)));
      accs = accs.reverse();
    } else {
      const newAccs = [];
      const old = fileCache[`indexed${timePeriod}`];
      const retro = fileCache.retro[`${timePeriod}accounts`];

      for(const a of accs) {
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

      accs = newAccs;
      if(reverse) {
        TimSort.sort(accs, (a, b) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
      } else {
        TimSort.sort(accs, (b, a) => (a.lbProp ?? 0) - (b.lbProp ?? 0));
      }
    }

    accs = accs.slice(0, Math.min(accs.length, max));

    Logger.verbose("Minifying data");
    if(min) {
      if(category == null) {
        accs.forEach((a) => {
          for(const key in a) {
            if(key != lbprop && key != "name" && key != "lbProp" && key != "uuid" && key != "rank" && key != "plusColor" && key != "mvpColor") {
              delete a[key];
            }
          }
        });
      } else {
        accs.forEach((a) => {
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

    let acceptEncoding = req.headers["accept-encoding"];
    if (!acceptEncoding) {
      acceptEncoding = "";
    }

    const cb = () => {};
    const s = new Readable();

    s._read = () => {};

    s.push(JSON.stringify(accs));
    s.push(null);

    Logger.verbose("Sending data");
    if (/\bdeflate\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "deflate" });
      pipeline(s, zlib.createDeflate(), res, cb);
    } else if (/\bgzip\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "gzip" });
      pipeline(s, zlib.createGzip(), res, cb);
    } else if (/\bbr\b/.test(acceptEncoding)) {
      res.writeHead(200, { "Content-Encoding": "br" });
      pipeline(s, zlib.createBrotliCompress(), res, cb);
    } else {
      res.writeHead(200, {});
      pipeline(s, res, cb);
    }

    Logger.verbose("Done");

  } else {
    res.statusCode = 404;
    res.end();
  }
};
