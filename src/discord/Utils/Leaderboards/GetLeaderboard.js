const ImageGenerator = require("../../images/ImageGenerator");
const Database = require("../Database");
const DrawLeaderboard = require("./DrawLeaderboard");

let lbCache = {};

setInterval(() => lbCache = {}, 600000);

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
 * @param {number} number
 * @returns {string} Formatted number
 */
function formatNum (number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {string} category
 * @param {number} start
 * @param {boolean} reverse
 * @param {Function} formatter
 * @returns {Promise<ImageGenerator>}
 */
module.exports = async function GetLeaderboard (prop, timetype, category, start, reverse = false, formatter = formatNum) {
  let res = "";
  let time;
  const startingIndex = start ?? 0;

  switch(timetype) {
  case "d": {
    time = "Daily";

    if(lbCache[prop + category + timetype] != undefined) {
      res = [...lbCache[prop + category + timetype]];
    } else {
      const lb = await Database.getLeaderboard(prop, category, "day", false, reverse);
      lbCache[prop + category + timetype] = lb;
      res = [...lb];
    }

    res = res.slice(startingIndex, startingIndex + 10);
    break;
  }

  case "w": {
    time = "Weekly";

    if(lbCache[prop + category + timetype] != undefined) {
      res = [...lbCache[prop + category + timetype]];
    } else {
      const lb = await Database.getLeaderboard(prop, category, "weekly", false, reverse);
      lbCache[prop + category + timetype] = lb;
      res = [...lb];
    }

    res = res.slice(startingIndex, startingIndex + 10);

    break;
  }

  case "m": {
    time = "Monthly";

    if(lbCache[prop + category + timetype] != undefined) {
      res = [...lbCache[prop + category + timetype]];
    } else {
      const lb = await Database.getLeaderboard(prop, category, "monthly", false, reverse);
      lbCache[prop + category + timetype] = lb;
      res = [...lb];
    }

    res = res.slice(startingIndex, startingIndex + 10);
    break;
  }

  default: {
    time = "Lifetime";

    if(lbCache[prop + category + timetype] != undefined) {
      res = [...lbCache[prop + category + timetype]];
    } else {
      const lb = await Database.getLeaderboard(prop, category, undefined, false, reverse);
      lbCache[prop + category + timetype] = lb;
      res = [...lb];
    }
    res = res.slice(startingIndex, startingIndex + 10);
    break;
  }
  }

  let getter;
  if(time != "Lifetime") {
    getter = (a) => a?.lbProp ?? 0;
  } else if(prop?.startsWith(".")) {
    getter = (a) => getProp(a, prop) ?? 0;
  } else if(category == null) {
    getter = (a) => a?.[prop] ?? 0;
  } else {
    getter = (a) => a?.[category]?.[prop] ?? 0;
  }

  return DrawLeaderboard(res, getter, time, startingIndex, formatter);
};

