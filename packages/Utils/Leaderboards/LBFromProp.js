const Json = require("@hyarcade/utils/FileHandling/Json");
const { getList } = require("@hyarcade/utils/Leaderboards/ListUtils");

module.exports = async function listDiffByProp(name, prop, timetype, maxamnt, category) {
  let newlist;
  let oldlist;
  if (name == "accounts") {
    newlist = await getList();
    oldlist = await getList(timetype);
  } else {
    newlist = await Json.read(`${name}.json`);
    oldlist = await Json.read(`${name}.${timetype}.json`);
  }

  let acc;
  for (const oldAcc of oldlist) {
    acc = newlist.find(g => g?.uuid == oldAcc?.uuid);
    // make sure acc isnt null/undefined
    if (acc == undefined || acc == undefined) {
      continue;
    }

    if (category == undefined) {
      oldAcc[prop] = (acc[prop] ?? 0) - (oldAcc[prop] ?? 0);
    } else {
      if (oldAcc[category] != undefined) {
        oldAcc[category][prop] = (acc?.[category]?.[prop] ?? 0) - (oldAcc?.[category]?.[prop] ?? 0);
      } else {
        oldAcc[category] = {};
        oldAcc[category][prop] = (acc?.[category]?.[prop] ?? 0) - (oldAcc?.[category]?.[prop] ?? 0);
      }
    }
  }

  return oldlist.slice(0, maxamnt);
};
