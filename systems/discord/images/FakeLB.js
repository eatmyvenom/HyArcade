const Database = require("hyarcade-requests/Database");
const Arc3 = require("./FakeLBs/Arc3");
const Arc4 = require("./FakeLBs/Arc4");
const Arc5 = require("./FakeLBs/Arc5");
const Arc6 = require("./FakeLBs/Arc6");
const ArcLeft = require("./FakeLBs/ArcLeft");
const Guild = require("./FakeLBs/Guild");
const { getFromDB, getBanlist } = require("../BotRuntime");

const generics = [Arc3, Arc4, Arc5, Arc6];

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

  if (category != "guild") {
    for (const acc of topTen) {
      const guild = await Database.guild(acc.uuid);

      acc.guildTag = guild?.tag ?? "";
      acc.guildTagColor = guild?.color;
    }
  }

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
          let random = chooseRandom(0, generics.length - 1);

          return await generics[random](path, category, realTime, topTen);
        }
      }
    }
  }
};
