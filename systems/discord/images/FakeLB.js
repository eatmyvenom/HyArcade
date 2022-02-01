const { getFromDB, getBanlist } = require("../BotRuntime");
const Database = require("hyarcade-requests/Database");
const Arc3 = require("./FakeLBs/Arc3");
const ArcLeft = require("./FakeLBs/ArcLeft");
const Guild = require("./FakeLBs/Guild");


module.exports = async function FakeLb (path, category, time) {

  let realTime = time;
  let topTen;

  if(category == "guild") {
    topTen = await getFromDB("guilds");
    topTen = topTen.sort((a, b) => b?.[path] - a?.[path]);
  } else if(path == undefined) {
    realTime = "monthly";
    topTen = await Database.getMWLeaderboard("wins", "monthly");
  } else {
    topTen = await Database.getLeaderboard(path, category, realTime);
  }

  const banlist = await getBanlist();
  topTen = topTen.filter((a) => !banlist.includes(a.uuid));
  topTen = topTen.slice(0, 10);

  switch(path) {
  case "coinsEarned":
  case "arcadeCoins": {
    return await ArcLeft(path, undefined, realTime, topTen);
  }

  default : {
    switch (category) {
    case "guild": {
      return Guild(path, category, realTime, topTen);
    }

    default: {
      return await Arc3(path, category, realTime, topTen);
    }
    }
  }
  }
};