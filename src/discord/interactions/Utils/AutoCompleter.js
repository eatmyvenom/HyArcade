const { AutocompleteInteraction } = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const BotRuntime = require("../../BotRuntime");
const Logger = require("hyarcade-logger");

/**
 * @type {Account}
 */
let testStats = undefined;


/**
 * @param {AutocompleteInteraction} interaction
 */
async function filler (interaction) {
  if(interaction.commandName == "leaderboard") {
    await leaderboardFiller(interaction);
  }
}

let categorys = undefined;
let genStats;

/**
 * 
 * @param {AutocompleteInteraction} interaction 
 */
async function leaderboardFiller (interaction) {

  if(testStats == undefined) {
    testStats = await BotRuntime.resolveAccount("vnmm", undefined, false, undefined, false);
  }

  const category = interaction.options.getString("category");
  const stat = interaction.options.getString("stat");

  switch(interaction.options.getFocused(true).name) {
  case "category" : {

    if(categorys == undefined) {
      categorys = {};
      categorys.General = "others";

      for(const key in testStats) {
        if(typeof testStats[key] == "object" && !Array.isArray(testStats[key])) {
          let formatted = key
            .replace(/([A-Z])/g, " $1")
            .replace(/_zombies/g, "")
            .replace(/(\.)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`)
            .replace(/(_)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`);

          formatted = `${formatted.slice(0, 1).toUpperCase()}${formatted.slice(1)}`;
          categorys[formatted] = key;
        }
      }

      categorys["Farm Hunt"] = categorys.Farmhunt;
      categorys.Seasonal = categorys["Seasonal Wins"];

      delete categorys["Seasonal Wins"];
      delete categorys["Arcade Achievments"];
      delete categorys.Farmhunt;
      delete categorys.Positions;
    }

    const allKeys = Object.keys(categorys);
    const keys = allKeys.filter((k) => k.toLowerCase().startsWith(category.toLowerCase())).sort();

    const types = keys.length > 0 ? keys.map((k) => ({ name: k, value: categorys[k] })) : allKeys.map((k) => ({ name: k, value: categorys[k] }));

    try {
      interaction.respond(types.sort());
    } catch (e) {
      Logger.err(e);
    }
    break;
  }

  case "stat" : {

    if(category != "general" && category != "others") {
      const types = Object.keys(testStats[category]).map((k) => ({ name:
        k.slice(0, 1).toUpperCase() +
        k.slice(1).replace(/([A-Z])/g, " $1")
          .replace(/_zombies/g, "")
          .replace(/(\.)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`)
          .replace(/(_)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`), 
      value: k }));

      const filtered = types.filter((v) => v.name.toLowerCase().startsWith(stat.toLowerCase()));
      const res = filtered.length > 0 ? filtered : types;

      try {
        interaction.respond(res.slice(0, Math.min(24, res.length)));
      } catch (e) {
        Logger.err(e);
      }
    } else if (category == "others") {
      if(genStats == undefined) {
        genStats = {};
        for(const key in testStats) {
          if(typeof testStats[key] == "number") {
            let formatted = key.replace(/([A-Z])/g, " $1")
              .replace(/_zombies/g, "")
              .replace(/(\.)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`)
              .replace(/(_)(\S)/g, (s) => ` ${s.slice(1).toUpperCase()}`);

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
      }
      const types = Object.keys(genStats)
        .map((k) => ({ name: k, value: genStats[k] }))
        .sort();

      const filtered = types.filter((v) => v.name.toLowerCase().startsWith(stat.toLowerCase())).sort();
      const res = filtered.length > 0 ? filtered : types;

      try {
        interaction.respond(res.slice(0, Math.min(24, res.length)));
      } catch (e) {
        Logger.err(e);
      }
    }

    break;
  }
  }
}

module.exports = filler;