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
 * @returns {Promise<MessageEmbed>}
 */
module.exports = async function GetLeaderboard (prop, timetype, category, start, reverse = false) {
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


  for(let i = 0; i < res.length; i += 1) {

    const y = 160 + (i * 65);
    const size = "40px";

    img.writeText(`${startingIndex + i + 1})`, 240, y, "left", "#FFFF55", size);
    img.writeAcc(res[i], 340, y, size);
    let val;
    if(category == undefined) {
      val = res[i]?.[prop] ?? 0;
    } else {
      val = res[i]?.[category]?.[prop] ?? 0;
    }

    img.writeText(`${formatNum(val)}`, 980, y, "right", "#FFFFFF", size);
  }

  return img;
};