import { createRequire } from "node:module";
import PartyGamesMenu from "../interactions/Components/Menus/Generators/PartyGamesMenu.js";
const require = createRequire(import.meta.url);

const Command = require("hyarcade-structures/Discord/Command");
const { Database } = require("hyarcade-requests");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const AccountComparitor = require("../Utils/AccountComparitor");
const { ERROR_WAS_NOT_IN_DATABASE } = require("../Utils/Embeds/DynamicEmbeds");
const { ERROR_IGN_UNDEFINED } = require("../Utils/Embeds/StaticEmbeds");
const PartyGamesImg = require("../images/PartyGamesImg");

/**
 *
 * @param {string} ign
 * @returns {CommandResponse}
 */
function nonDatabaseError(ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

export default new Command(
  ["party-games", "pg", "partygames"],
  ["*"],
  async (args, rawMsg, interaction) => {
    const plr = args[0];
    const game = args[1] ?? "Party Games";
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
        return nonDatabaseError(res?.acc?.name);
      }
      acc = AccountComparitor(res?.acc, res?.timed);
    }

    if (acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_IGN_UNDEFINED);

    const img = await PartyGamesImg(acc, game);
    const menu = PartyGamesMenu(acc.uuid, game, time);
    return new CommandResponse("", undefined, img, menu);
  },
  2500,
);
