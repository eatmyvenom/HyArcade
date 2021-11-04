const ImageGenerator = require("../../images/ImageGenerator");

/**
 * 
 * @param {*} res 
 * @param {*} valueGetter
 * @param {*} time 
 * @param {*} startingIndex 
 * @param {*} formatter 
 * @returns {ImageGenerator}
 */
async function DrawLeaderboard (res, valueGetter, time, startingIndex, formatter) {
  const img = new ImageGenerator(2560, 1600, "'myFont'", true);
  await img.addBackground("resources/arcblur.png", 0, 0, 2560, 1600, "#0000008F");

  img.writeText(`&l${time} Leaderboard`, 1280, 170, "center", "#55FF55", "80px");

  const testVal = valueGetter(res[0]) ?? 0;

  if(testVal == 0) {
    img.writeText("Nobody has done this yet!", 1280, 800, "center", "#FF5555", "96px");
    return img;
  }

  const size = "80px";
  const placeColor = "#FFFF55";
  
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

    img.writeText(`${startingIndex + i + 1})`, 1280 - (longestName / 1.5) - 100, y, "left", placeColor, size);
    img.writeAcc(res[i], 1280 - (longestName / 1.5) + 100, y, size);

    img.writeText(`${formatter(val)}`.trim(), 1280 + (longestName / 1.5) + (longestVal) - 55, y, "right", "#FFFFFF", size);
  }

  return img;
}

module.exports = DrawLeaderboard;