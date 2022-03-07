const Config = require("hyarcade-config");
const Logger = require("hyarcade-logger");
const GetAsset = require("hyarcade-utils/FileHandling/GetAsset");
const ImageGenerator = require("../../images/ImageGenerator");

const cfg = Config.fromJSON();

/**
 *
 * @param {*} res
 * @param {*} valueGetter
 * @param {string} time
 * @param {number} startingIndex
 * @param {*} formatter
 * @param {string} title
 * @returns {ImageGenerator}
 */
async function DrawLeaderboard(res, valueGetter, time, startingIndex, formatter, title) {
  const img = new ImageGenerator(2560, 1600, "'myFont'", true);
  Logger.verbose("Adding background");
  await img.addBackground(GetAsset(cfg.commandImages.leaderboard.file), 0, 0, 2560, 1600, cfg.commandImages.leaderboard.overlay);

  Logger.verbose("Drawing text");
  img.drawMcText(`&e${title}`, 1280, 80, 112, "center");
  img.drawMcText(`&a&l${time} Leaderboard`, 1280, 170, 80, "center");

  const testVal = valueGetter(res[0]) ?? 0;

  if (testVal == 0) {
    img.writeText("Nobody has done this yet!", 1280, 800, "center", "#FF5555", "96px");
    return img;
  }

  const size = "80px";

  img.context.font = `${size} ${img.font}`;
  let longestName = 0;
  let longestVal = 0;

  for (const re of res) {
    const name = img.context.measureText(`${re?.rank?.replace(/_PLUS/g, "+") ?? ""} ${re.name} `);

    const val = valueGetter(re) ?? 0;

    const valM = img.context.measureText(`${formatter(val)}`);

    if (name.width > longestName) {
      longestName = name.width;
    }

    if (valM.width > longestVal) {
      longestVal = valM.width;
    }
  }

  for (const [i, re] of res.entries()) {
    const y = 320 + i * 130;
    const val = valueGetter(re) ?? 0;

    if (!(val > 0)) {
      continue;
    }

    let placeFormat = "&7#";

    if (startingIndex + i + 1 == 1) {
      placeFormat = "&6&l#";
    } else if (startingIndex + i + 1 == 2) {
      placeFormat = "&f&l#";
    } else if (startingIndex + i + 1 == 3) {
      placeFormat = "&e&l#";
    }

    img.drawMcText(`${placeFormat}${startingIndex + i + 1}`, 1280 - longestName / 2 - longestVal, y, size.replace(/px/g, ""), "right");
    img.drawMcText(ImageGenerator.formatAcc(re, true, false, false), 50 + 1280 - longestName / 2 - longestVal, y, size.replace(/px/g, ""), "left");

    img.drawMcText(`&e${formatter(val)}`.trim(), 1280 + longestName / 1.5 + 50, y, size.replace(/px/g, ""), "right");
  }

  return img;
}

module.exports = DrawLeaderboard;
