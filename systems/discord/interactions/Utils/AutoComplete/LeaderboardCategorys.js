const Logger = require("@hyarcade/logger");

let categorys;

module.exports = async function LeaderboardCategorys(category, interaction, testStats) {
  if (categorys == undefined) {
    categorys = {};
    categorys.General = "others";

    for (const key in testStats) {
      if (typeof testStats[key] !== "string" && typeof testStats[key] === "object" && !Array.isArray(testStats[key])) {
        let formatted = key
          .replace(/([A-Z])/g, " $1")
          .replace(/_zombies/g, "")
          .replace(/(\.)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`)
          .replace(/(_)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`);

        formatted = `${formatted.slice(0, 1).toUpperCase()}${formatted.slice(1)}`;
        categorys[formatted] = key;
      }
    }

    categorys["Farm Hunt"] = categorys.Farmhunt;
    categorys.Seasonal = categorys["Seasonal Wins"];
    categorys["Arcade Quests"] = categorys.Quests;

    delete categorys["Action Time"];
    delete categorys["Seasonal Wins"];
    delete categorys["Arcade Achievments"];
    delete categorys.Quests;
    delete categorys.Farmhunt;
    delete categorys.Positions;
    delete categorys.Extra;
  }

  const allKeys = Object.keys(categorys);
  const keys = allKeys.filter(k => k.toLowerCase().startsWith(category.toLowerCase())).sort();

  const types = keys.length > 0 ? keys.map(k => ({ name: k, value: categorys[k] })) : [];

  try {
    interaction.respond(types.sort());
  } catch (error) {
    Logger.err(error);
  }
};
