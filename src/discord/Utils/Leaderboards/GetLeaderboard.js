const { MessageEmbed } = require("discord.js");
const ImageGenerator = require("../../images/ImageGenerator");
const Database = require("../Database");

let lbCache = {};

setInterval(() => lbCache = {}, 600000);

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
 * @returns {Promise<MessageEmbed>}
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

  const img = new ImageGenerator(1280, 800, "'myFont'");
  await img.addBackground("resources/arcblur.png", 0, 0, 1280, 800, "#0000008F");

  img.writeText(`${time} Leaderboard`, 640, 85, "center", "#55FF55", "40px");

  let testVal;
  if(category == undefined) {
    testVal = res[0]?.[prop] ?? 0;
  } else {
    testVal = res[0]?.[category]?.[prop] ?? 0;
  }

  if(testVal == 0) {
    img.writeText("Nobody has done this yet!", 640, 400, "center", "#FF5555", "48px");
    return img;
  }

  const size = "40px";
  const placeColor = "#FFFF55";

  img.context.font = `${size} ${img.font}`;
  let longestName = 0;
  let longestVal = 0;

  for(let i = 0; i < res.length; i += 1) {
    const name = img.context.measureText(res[i].name);

    let val;
    if(category == undefined) {
      val = res[i]?.[prop] ?? 0;
    } else {
      val = res[i]?.[category]?.[prop] ?? 0;
    }

    const valM = img.context.measureText(`${formatter(val)}`);

    if(name.width > longestName) {
      longestName = name.width;
    }

    if(valM.width > longestVal) {
      longestVal = valM.width;
    }
  }

  for(let i = 0; i < res.length; i += 1) {

    const y = 160 + (i * 65);

    img.writeText(`${startingIndex + i + 1})`, 640 - (longestName / 1.2) - 100, y, "left", placeColor, size);
    img.writeAcc(res[i], 640 - (longestName / 1.2), y, size);
    let val;
    if(category == undefined) {
      val = res[i]?.[prop] ?? 0;
    } else {
      val = res[i]?.[category]?.[prop] ?? 0;
    }

    img.writeText(`${formatter(val)}`, 640 + (longestName / 1.2) + (longestVal), y, "right", "#FFFFFF", size);
  }

  return img;
};