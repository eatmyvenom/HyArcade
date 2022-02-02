const Database = require("hyarcade-requests/Database");
const Arc3 = require("./FakeLBs/Arc3");
const Arc4 = require("./FakeLBs/Arc4");
const ArcLeft = require("./FakeLBs/ArcLeft");
const Guild = require("./FakeLBs/Guild");
const { getFromDB, getBanlist } = require("../BotRuntime");

/**
 * @param {number} lowerBound
 * @param {number} upperBound
 * @returns {number}
 */
function chooseRandom(lowerBound, upperBound) {
  const num = Math.floor(Math.random() * (upperBound + 1 - lowerBound));

  return num + lowerBound;
}

module.exports = async function FakeLb(path, category, time) {
  let realTime = time;
  let topTen;

  if (category == "guild") {
    topTen = await getFromDB("guilds");
    topTen = topTen.sort((a, b) => b?.[path] - a?.[path]);
  } else if (path == undefined) {
    realTime = "monthly";
    topTen = await Database.getMWLeaderboard("wins", "monthly");
  } else {
    topTen = await Database.getLeaderboard(path, category, realTime);
  }

  const banlist = await getBanlist();
  topTen = topTen.filter(a => !banlist.includes(a.uuid));
  topTen = topTen.slice(0, 10);

  switch (path) {
    case "coinsEarned":
    case "arcadeCoins": {
      return await ArcLeft(path, undefined, realTime, topTen);
    }

    default: {
      switch (category) {
        case "guild": {
          return Guild(path, category, realTime, topTen);
        }

        default: {
          let random = chooseRandom(0, 1);

          return await (random == 0 ? Arc4(path, category, realTime, topTen) : Arc3(path, category, realTime, topTen));
        }
      }
    }
  }
};
