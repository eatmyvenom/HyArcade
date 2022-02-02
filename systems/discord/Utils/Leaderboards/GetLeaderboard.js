const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const DrawLeaderboard = require("./DrawLeaderboard");
const ImageGenerator = require("../../images/ImageGenerator");

let lbCache = {};

setInterval(() => (lbCache = {}), 600000);

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp(o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const a = str.split(".");
  for (let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if (k in obj) {
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
function formatNum(number) {
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
module.exports = async function GetLeaderboard(
  prop,
  timetype,
  category,
  start,
  reverse = false,
  formatter = formatNum,
) {
  let res = "";
  let time;
  const startingIndex = start ?? 0;

  switch (timetype) {
    case "d": {
      time = "Daily";

      if (lbCache[`${prop}${category}${timetype}`] != undefined) {
        res = [...lbCache[`${prop}${category}${timetype}`]];
      } else {
        const lb = await Database.getLeaderboard(prop, category, "day", true, reverse);
        lbCache[`${prop}${category}${timetype}`] = lb;
        res = [...lb];
      }

      res = res.slice(startingIndex, startingIndex + 10);
      break;
    }

    case "w": {
      time = "Weekly";

      if (lbCache[`${prop}${category}${timetype}`] != undefined) {
        res = [...lbCache[`${prop}${category}${timetype}`]];
      } else {
        const lb = await Database.getLeaderboard(prop, category, "weekly", true, reverse);
        lbCache[`${prop}${category}${timetype}`] = lb;
        res = [...lb];
      }

      res = res.slice(startingIndex, startingIndex + 10);

      break;
    }

    case "m": {
      time = "Monthly";

      if (lbCache[`${prop}${category}${timetype}`] != undefined) {
        res = [...lbCache[`${prop}${category}${timetype}`]];
      } else {
        const lb = await Database.getLeaderboard(prop, category, "monthly", true, reverse);
        lbCache[`${prop}${category}${timetype}`] = lb;
        res = [...lb];
      }

      res = res.slice(startingIndex, startingIndex + 10);
      break;
    }

    default: {
      time = "Lifetime";

      if (lbCache[`${prop}${category}${timetype}`] != undefined) {
        res = [...lbCache[`${prop}${category}${timetype}`]];
      } else {
        const lb = await Database.getLeaderboard(prop, category, undefined, true, reverse);
        lbCache[`${prop}${category}${timetype}`] = lb;
        res = [...lb];
      }
      res = res.slice(startingIndex, startingIndex + 10);
      break;
    }
  }

  Logger.verbose("Generating getter");

  let getter;
  let title;
  if (prop?.startsWith(".")) {
    getter = a => getProp(a, prop) ?? 0;
    title = `${prop.slice(1, 2).toUpperCase()}${prop.slice(2)}`
      .replace(/([A-Z])/g, " $1")
      .replace(/_zombies/g, "")
      .replace(/(\.)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`)
      .replace(/(_)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`);
  } else if (category == null) {
    title = `${prop.slice(0, 1).toUpperCase()}${prop.slice(1)}`.replace(/([A-Z])/g, " $1");
    getter = a => a?.[prop] ?? 0;
  } else {
    title = `${category.slice(0, 1).toUpperCase()}${category.slice(1)}.${prop}`
      .replace(/([A-Z])/g, " $1")
      .replace(/_zombies/g, "")
      .replace(/(\.)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`)
      .replace(/(_)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`);

    getter = a => a?.[category]?.[prop] ?? 0;
  }

  if (time != "Lifetime") {
    getter = a => a?.lbProp ?? 0;
  }

  title = title.replace(/P B/g, "PB");
  title = title.replace(/Arcade Achievments /g, "");
  title = title.replace(/Tiered A P\[0\]/g, "AP-1");
  title = title.replace(/Tiered A P\[1\]/g, "AP-2");
  title = title.replace(/Tiered A P\[2\]/g, "AP-3");
  title = title.replace(/Tiered A P\[3\]/g, "AP-4");
  title = title.replace(/Tiered A P\[4\]/g, "AP-5");
  title = title.replace(/Farmhunt/g, "Farm Hunt");
  title = title.replace(/Wool Wool/g, "Wool");
  title = title.replace(/Time 30/g, "Win");

  if (title.includes("Seasonal Wins")) {
    title = title.replace(/Seasonal Wins /g, "");
    if (!title.trim().includes(" ")) {
      title += " Simulator Wins";
    }
  }

  if (title.includes("Arcade Challenges")) {
    title = title.replace(/Arcade Challenges /g, "");
    title += " Challenge Completions";
  }

  Logger.verbose("Drawing image");
  return DrawLeaderboard(res, getter, time, startingIndex, formatter, title);
};
