const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const AccountComparitor = require("../Utils/AccountComparitor");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_WAS_NOT_IN_DATABASE } = require("../Utils/Embeds/DynamicEmbeds");
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

module.exports = new Command(["stats", "s", "sts"], ["*"], async (args, rawMsg, interaction) => {
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
  if(interaction == undefined) {
    res = await BotRuntime.resolveAccount(plr, rawMsg, true, time);
  } else {
    await interaction.defer();
    res = await InteractionUtils.resolveAccount(interaction, "player", time);
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


  const cmdRes = await BotRuntime.getStats(acc, `${game}`);
  const e = cmdRes.embed;
  const menu = await MenuGenerator.statsMenu(acc.uuid, time, cmdRes.game);
  return {
    res: "",
    embed: e,
    b: menu
  };
}, 2500);
