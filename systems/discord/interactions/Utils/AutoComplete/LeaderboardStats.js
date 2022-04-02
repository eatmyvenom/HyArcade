const Logger = require("@hyarcade/logger");

let genStats;

module.exports = async function LeaderboardStats(category, stat, interaction, testStats) {
  if (category != "general" && category != "others" && testStats[category]) {
    const types = Object.keys(testStats[category] ?? {}).map(k => ({
      name:
        k.slice(0, 1).toUpperCase() +
        k
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .replace(/_zombies/g, "")
          .replace(/(\.)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`)
          .replace(/(_)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`),
      value: k,
    }));

    const filtered = types.filter(v => v.name.toLowerCase().startsWith(stat.toLowerCase()));
    const res = filtered.length > 0 ? filtered : types;

    try {
      interaction.respond(res.slice(0, Math.min(24, res.length)));
    } catch (error) {
      Logger.err(error);
    }
  } else if (category == "others") {
    if (genStats == undefined) {
      genStats = {};
      for (const key in testStats) {
        if (typeof testStats[key] == "number") {
          let formatted = key
            .replace(/([A-Z])/g, " $1")
            .replace(/_zombies/g, "")
            .replace(/(\.)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`)
            .replace(/(_)(\S)/g, s => ` ${s.slice(1).toUpperCase()}`);

          formatted = `${formatted.slice(0, 1).toUpperCase()}${formatted.slice(1)}`;

          genStats[formatted] = key;
        }
      }

      delete genStats["Lb Prop"];
      delete genStats["First Login"];
      delete genStats["Last Login"];
      delete genStats["Last Logout"];
      delete genStats["Time Playing"];
      delete genStats["Sim Total"];
      delete genStats["Weekly Coins"];
      delete genStats["Time Playing"];
      delete genStats["Update Time"];
      delete genStats["Importance"];
      delete genStats["Monthly Coins"];
      delete genStats["Update Time"];
      delete genStats["Quests Completed"];
      delete genStats["Ranks Gifted"];
      delete genStats["Unknown Wins"];
      delete genStats["Xp"];
    }

    const types = Object.keys(genStats)
      .map(k => ({ name: k, value: genStats[k] }))
      .sort();

    const filtered = types.filter(v => v.name.toLowerCase().startsWith(stat.toLowerCase())).sort();
    const res = filtered.length > 0 ? filtered : [];

    try {
      interaction.respond(res.slice(0, Math.min(24, res.length)).sort());
    } catch (error) {
      Logger.err(error);
    }
  } else {
    try {
      interaction.respond([]);
    } catch (error) {
      Logger.err(error);
    }
  }
};
