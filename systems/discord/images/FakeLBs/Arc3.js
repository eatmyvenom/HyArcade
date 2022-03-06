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

module.exports = async function Arc3(path, category, time, topTen) {
  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground(GetAsset("lb3.png"), 0, 0, 1900, 1035, "#00000000");

  let y = 100;
  const dy = 48;
  const x = 915;
  const fontSize = 32;

  let timeTitle = path == undefined ? "Monthly" : time == undefined ? "Lifetime" : `${time.slice(0, 1).toUpperCase()}${time.slice(1)}`;
  let gameTitle = "";

  timeTitle += `${(path ?? "wins").slice(0, 1).toUpperCase()}${(path ?? "wins").slice(1)}`.replace(/([A-Z])/g, " $1");
  if (timeTitle.includes("_")) {
    timeTitle = timeTitle.slice(0, timeTitle.indexOf("_"));
  }

  switch (category) {
    case "blockingDead":
      gameTitle = "Blocking Dead";
      break;
    case "bountyHunters":
      gameTitle = "Bounty Hunters";
      break;
    case "captureTheWool":
      gameTitle = "Capture the Wool";
      break;
    case "dragonWars":
      gameTitle = "Dragon Wars";
      break;
    case "enderSpleef":
      gameTitle = "Ender Spleef";
      break;
    case "farmhunt":
      gameTitle = "Farm Hunt";
      break;
    case "football":
      gameTitle = "Football";
      break;
    case "galaxyWars":
      gameTitle = "Galaxy Wars";
      break;
    case "hideAndSeek":
      gameTitle = "Hide and Seek";
      break;
    case "holeInTheWall":
      gameTitle = "Hole in the Wall";
      break;
    case "hypixelSays":
      gameTitle = "Hypixel Says";
      break;
    case "partyGames":
      gameTitle = "Party Games";
      break;
    case "pixelPainters":
      gameTitle = "Pixel Painters";
      break;
    case "throwOut":
      gameTitle = "Throw Out";
      break;
    case "zombies":
      gameTitle = "Zombies";
      break;
    default:
      gameTitle = "Mini Walls";
  }

  await img.drawMcText(`&l&b${timeTitle}`, x, (y += dy), fontSize, "center", true);
  await img.drawMcText(`&7${gameTitle}`, x, (y += dy), fontSize, "center", true);
  y += 10;

  const custom = false;

  if (custom) {
    // eslint-disable-next-line no-param-reassign
    topTen = [
      { name: "Slakshads", rank: "MVP_PLUS", lbProp: 1291, guildTag: "SWAG", guildTagColor: "YELLOW" },
      { name: "Voizion", rank: "MVP_PLUS_PLUS", lbProp: 959, guildTag: "SWAG", guildTagColor: "YELLOW" },
      { name: "chuey", rank: "MVP_PLUS_PLUS", lbProp: 917, guildTag: "SWAG", guildTagColor: "YELLOW" },
      { name: "AZZU_", rank: "VIP_PLUS", lbProp: 895, guildTag: "✌︎LG❤", guildTagColor: "YELLOW" },
      { name: "tinykorean", rank: "MVP_PLUS_PLUS", lbProp: 875, guildTag: "SWAG", guildTagColor: "YELLOW" },
      { name: "xdragons", rank: "MVP_PLUS_PLUS", lbProp: 799, guildTag: "AP", guildTagColor: "GREY" },
      { name: "Woalfy", rank: "MVP_PLUS_PLUS", lbProp: 741, guildTag: "VAIL", guildTagColor: "YELLOW" },
      { name: "Virtud", rank: "MVP_PLUS", lbProp: 740, guildTag: "", guildTagColor: "" },
      { name: "feithy", rank: "MVP_PLUS_PLUS", lbProp: 732, guildTag: "MEXICO", guildTagColor: "DARK_AQUA" },
      { name: "_Osirus", rank: "MVP_PLUS_PLUS", lbProp: 680, guildTag: "EATBEE", guildTagColor: "GREY" },
    ];
  }

  for (const [i, account] of topTen.entries()) {
    if (time == undefined) {
      img.drawLBPlayer(account, `${i + 1}`, formatNum(account?.[category]?.[path] ?? account?.miniWalls?.wins), x, (y += dy), fontSize);
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
