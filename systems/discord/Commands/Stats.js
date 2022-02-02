const Database = require("hyarcade-requests/Database");
const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");
const AccountComparitor = require("../Utils/AccountComparitor");
const { ERROR_WAS_NOT_IN_DATABASE } = require("../Utils/Embeds/DynamicEmbeds");
const { ERROR_IGN_UNDEFINED } = require("../Utils/Embeds/StaticEmbeds");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");

/**
 *
 * @param {string} ign
 * @returns {CommandResponse}
 */
function nonDatabaseError(ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

module.exports = new Command(
  ["old-stats"],
  ["*"],
  async (args, rawMsg, interaction) => {
    const plr = args[0] ?? "!";
    const game = args[1];
    let time = args[2] ?? "lifetime";

    switch (time.toLowerCase()) {
      case "d":
      case "day":
      case "dae":
      case "daily":
      case "today": {
        time = "day";
        break;
      }

      case "w":
      case "week":
      case "weak":
      case "weekly":
      case "weeekly": {
        time = "weekly";
        break;
      }

      case "m":
      case "monthly":
      case "month":
      case "mnth":
      case "mnthly":
      case "mon": {
        time = "monthly";
        break;
      }

      default: {
        time = "lifetime";
      }
    }

    let acc;
    let res;
    if (interaction == undefined) {
      res = await Database.timedAccount(plr, rawMsg.author.id, time);
    } else {
      if (interaction.isButton()) {
        await interaction.deferUpdate();
        res = await Database.timedAccount(plr, "", time);
      } else if (interaction.isSelectMenu()) {
        await interaction.deferUpdate();
        res = await Database.timedAccount(plr, "", time);
      } else {
        await interaction.deferReply();
        res = await Database.timedAccount(interaction.options.getString("player"), interaction.user.id, time);
      }
    }

    if (time == "lifetime") {
      acc = res;
    } else {
      if (res?.timed == undefined) {
        return nonDatabaseError(res?.acc?.name ?? "INVALID-NAME");
      }
      acc = AccountComparitor(res?.acc, res?.timed);
    }

    if (acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_IGN_UNDEFINED);

    const cmdRes = await BotRuntime.getStats(acc, `${game}`);
    const e = cmdRes.embed;
    const menu = await MenuGenerator.statsMenu(acc.uuid, time, game ?? "undefined");
    return {
      res: "",
      embed: e,
      b: menu,
    };
  },
  2500,
);
