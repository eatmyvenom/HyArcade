const ImageGenerator = require("../ImageGenerator");

const colorFormatters = {
  black: "&0",
  dark_blue: "&1",
  dark_green: "&2",
  dark_aqua: "&3",
  dark_red: "&4",
  dark_purple: "&5",
  gold: "&6",
  grey: "&7",
  gray: "&7",
  dark_gray: "&8",
  blue: "&9",
  green: "&a",
  aqua: "&b",
  red: "&c",
  light_purple: "&d",
  yellow: "&e",
  white: "&f",
  undefined: "&6"
};

/**
 * 
 * @param {number} n
 * @returns {string} 
 */
function formatNum (n) {
  const r = Intl.NumberFormat("en").format(Number(n));
  return r;
}

module.exports = async function Guild (path, category, time, topTen) {

  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground("resources/leaderboard-guild.png", 0, 0, 1900, 1035, "#00000000");

  let y = 100;
  const dy = 52;
  const x = 915;
  const fontSize = 36;

  let timeTitle = (time == undefined) ? "Lifetime" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)}`;
  timeTitle += " Arcade Games Experience";
  
  const gameTitle = "Top Hypixel Guilds";

  await img.drawMcText(`&b${gameTitle}`, x, y += dy, fontSize, "center", true);
  await img.drawMcText(`&a${timeTitle}`, x, y += dy, fontSize, "center", true);
  y += 10;

  for(let i = 0; i < topTen.length; i += 1) {
    await img.drawMcText(`&e${i + 1}. &6${topTen[i].name} ${colorFormatters[topTen[i].color.toLowerCase()]}[${topTen[i].tag}] &7-&e ${formatNum(topTen[i]?.[path])}`, x, y += dy, fontSize, "center", true);
  }

  y += 10;
  await img.drawMcText("&l&6Click to toggle!", x, y += dy, fontSize, "center", true);

  const strTime = time ?? "lifetime";
  await img.drawTimeType(strTime, x, y += dy, fontSize);

  return img.toDiscord();
};