const { MessageEmbed } = require("discord.js");
const { stringLBAdv } = require("../../../listUtils");
const StringifyLBDiffAdv = require("../../../utils/leaderboard/StringifyLBDiffAdv");

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

module.exports = async function CustomLeaderboard(timetype, type, startingIndex, limit) {
  let lb;
  let resTime = timetype;
  if (resTime == "lifetime" || resTime == "l") {
    resTime = "Lifetime";
    lb = await stringLBAdv(
      (a, b) => (getProp(b, type.trim()) ?? 0) - (getProp(a, type.trim()) ?? 0),
      a => getProp(a, type.trim()),
      limit,
      l => l,
      startingIndex,
    );
  } else {
    if (resTime == "d") resTime = "Daily";
    if (resTime == "w") resTime = "Weekly";
    if (resTime == "m") resTime = "Monthly";
    lb = await StringifyLBDiffAdv(
      (a, b) => (getProp(b, type.trim()) ?? 0) - (getProp(a, type.trim()) ?? 0),
      a => a.val,
      limit,
      timetype,
      (n, o) => (n.val = getProp(n, type.trim()) - getProp(o, type.trim())),
      l => l,
    );
  }

  if (lb.includes("(NaN)")) {
    throw new Error("Leaderboard Invalid");
  }
  return new MessageEmbed().setTitle(resTime).setColor(0x00cc66).setDescription(lb);
};
