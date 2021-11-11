const Database = require("../Utils/Database");
const Arc3 = require("./FakeLBs/Arc3");
const ArcLeft = require("./FakeLBs/ArcLeft");


module.exports = async function FakeLb (path, category, time) {

  let topTen;
  if(path == undefined) {
    topTen = (await Database.getMWLeaderboard("wins", "monthly")).slice(0, 10);
  } else {
    topTen = (await Database.getLeaderboard(path, category, time)).slice(0, 10);
  }

  switch(path) {
  case "arcadeCoins": {
    return await ArcLeft("coins", category, time, topTen);
  }

  default : {
    return await Arc3(path, category, time, topTen);
  }
  }
};