import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Command = require("../../classes/Command");
const { ERROR_WAS_NOT_IN_DATABASE } = require("../Utils/Embeds/DynamicEmbeds");
const AccountComparitor = require("../Utils/AccountComparitor");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const PartyGamesImg = require("../images/PartyGamesImg");
const {
  ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");

/**
 * 
 * @param {string} ign 
 * @returns {CommandResponse}
 */
function nonDatabaseError (ign) {
  return new CommandResponse("", ERROR_WAS_NOT_IN_DATABASE(ign));
}

export default new Command(["party-games", "pg", "partygames"], ["*"], async (args, rawMsg, interaction) => {
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
  if(interaction == undefined) {
    res = await BotRuntime.resolveAccount(plr, rawMsg, true, time);
  } else {
    if(interaction.isButton()) {
      await interaction.deferUpdate();
      res = await BotRuntime.resolveAccount(plr, undefined, false, time);
    } else if (interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      res = await BotRuntime.resolveAccount(plr, undefined, false, time);
    } else {
      await interaction.deferReply();
      res = await InteractionUtils.resolveAccount(interaction, "player", time);
    }
  }

  if(time == "lifetime") {
    acc = res;
  } else {
    if(res?.timed == undefined) {
      return nonDatabaseError(res?.acc?.name);
    }
    acc = AccountComparitor(res?.acc, res?.timed);
  }

  if(acc == undefined || acc.name == undefined || acc.name == "INVALID-NAME") return new CommandResponse("", ERROR_IGN_UNDEFINED);
  
  const img = await PartyGamesImg(acc, game);
  const menu = await MenuGenerator.partyGamesMenu(acc.uuid, game, time);
  return new CommandResponse("", undefined, img, menu);
}, 2500);