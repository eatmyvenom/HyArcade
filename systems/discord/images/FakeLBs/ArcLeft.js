const GetAsset = require("hyarcade-utils/FileHandling/GetAsset");
const ImageGenerator = require("../ImageGenerator");

/**
 *
 * @param {number} n
 * @returns {string}
 */
function formatNum(n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

module.exports = async function ArcLeft(path, category, time, topTen) {
  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground(GetAsset("leaderboard-left.png"), 0, 0, 1900, 1035, "#00000000");

  let y = 110;
  const dy = 52;
  const x = 970;
  const fontSize = 36;

  let timeTitle = time == undefined ? "Lifetime" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)}`;

  timeTitle += " Coins";

  await img.drawMcText(`&l&b${timeTitle}`, x, (y += dy), fontSize, "center", true);
  y += 18;

  for (const [i, account] of topTen.entries()) {
    if (time == undefined) {
      if (category == undefined) {
        img.drawLBPlayer(account, `${i + 1}`, formatNum(account?.arcadeCoins ?? account?.miniWalls?.wins), x, (y += dy), fontSize);
      } else {
        img.drawLBPlayer(account, `${i + 1}`, formatNum(account?.[category]?.[path] ?? account?.miniWalls?.wins), x, (y += dy), fontSize);
      }
    } else {
      img.drawLBPlayer(account, `${i + 1}`, formatNum(account?.lbProp ?? account?.miniWalls?.wins), x, (y += dy), fontSize);
    }
  }

  y += 10;
  await img.drawMcText("&l&6Click to toggle!", x, (y += dy), fontSize, "center", true);

  const strTime = path == undefined ? "monthly" : time ?? "lifetime";
  await img.drawTimeType(strTime, x, (y += dy), fontSize);

  return img.toDiscord();
};
