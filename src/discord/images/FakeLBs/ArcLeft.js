const ImageGenerator = require("../ImageGenerator");

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

module.exports = async function ArcLeft (path, category, time, topTen) {

  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground("resources/leaderboard-left.png", 0, 0, 1900, 1035, "#00000000");

  let y = 110;
  const dy = 52;
  const x = 970;
  const fontSize = 36;

  let timeTitle = path == undefined ? "Monthly" : (time == undefined) ? "Lifetime" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)}`;

  timeTitle += `${(path ?? "wins").slice(0, 1).toUpperCase()}${(path ?? "wins").slice(1)}`.replace(/([A-Z])/g, " $1");
  if(timeTitle.includes("_")) {
    timeTitle = timeTitle.slice(0, timeTitle.indexOf("_"));
  }

  await img.drawNameTag(timeTitle, x, y += dy, "#55FFFF", fontSize, "'boldmc'");
  y += 18;

  for(let i = 0; i < topTen.length; i += 1) {
    if(time == undefined) {
      if(category == undefined) {
        img.drawLBPlayer(topTen[i], `${i + 1}`, formatNum(topTen[i]?.arcadeCoins ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
      } else {
        img.drawLBPlayer(topTen[i], `${i + 1}`, formatNum(topTen[i]?.[category]?.[path] ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
      }
    } else {
      img.drawLBPlayer(topTen[i], `${i + 1}`, formatNum(topTen[i]?.lbProp ?? topTen[i]?.miniWalls?.wins), x, y += dy, fontSize);
    }
  }

  y += 10;
  await img.drawNameTag("Click to toggle!", x, y += dy, "#FFAA00", fontSize, "'boldmc'");

  const strTime = path == undefined ? "monthly" : time ?? "lifetime";
  await img.drawTimeType(strTime, x, y += dy, fontSize);

  return img.toDiscord();
};