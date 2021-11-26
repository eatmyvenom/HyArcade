const ImageGenerator = require("../../images/ImageGenerator");

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
async function DrawLeaderboard (res, valueGetter, time, startingIndex, formatter, title) {
  const img = new ImageGenerator(2560, 1600, "'myFont'", true);
  await img.addBackground("resources/arcblur.png", 0, 0, 2560, 1600, "#0000008F");

  img.drawMcText(`&e${title}`, 1280, 80, 112, "center");
  img.drawMcText(`&a&l${time} Leaderboard`, 1280, 170, 80, "center");

  const testVal = valueGetter(res[0]) ?? 0;

  if(testVal == 0) {
    img.writeText("Nobody has done this yet!", 1280, 800, "center", "#FF5555", "96px");
    return img;
  }

  const size = "80px";

  img.context.font = `${size} ${img.font}`;
  let longestName = 0;
  let longestVal = 0;

  for(let i = 0; i < res.length; i += 1) {
    const name = img.context.measureText(`${res[i]?.rank?.replace(/_PLUS/g, "+") ?? ""} ${res[i].name} `);

    const val = valueGetter(res[i]) ?? 0;

    const valM = img.context.measureText(`${formatter(val)}`);

    if(name.width > longestName) {
      longestName = name.width;
    }

    if(valM.width > longestVal) {
      longestVal = valM.width;
    }
  }

  for(let i = 0; i < res.length; i += 1) {

    const y = 320 + (i * 130);
    const val = valueGetter(res[i]) ?? 0;

    if (!(val > 0)) {
      continue;
    }

    let placeFormat = "&7#";

    if(startingIndex + i + 1 == 1) {
      placeFormat = "&6&l#";
    } else if (startingIndex + i + 1 == 2) {
      placeFormat = "&f&l#";
    } else if (startingIndex + i + 1 == 3) {
      placeFormat = "&e&l#";
    }

    img.drawMcText(`${placeFormat}${startingIndex + i + 1}`, 1280 - (longestName / 1.5) - 50, y, size.replace(/px/g, ""), "right");
    img.drawMcText(ImageGenerator.formatAcc(res[i], true, false, false), 1280 - (longestName / 1.5), y, size.replace(/px/g, ""), "left");

    img.drawMcText(`&e${formatter(val)}`.trim(), 1280 + (longestName / 1.5) + (longestVal) - 155, y, size.replace(/px/g, ""), "right");
  }

  return img;
}

module.exports = DrawLeaderboard;