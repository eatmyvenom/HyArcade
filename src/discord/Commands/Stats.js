const Logger = require("hyarcade-logger");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const AccountComparitor = require("../Utils/AccountComparitor");
const CommandResponse = require("../Utils/CommandResponse");
const {
  ERROR_UNLINKED
} = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("stats", ["*"], async (args, rawMsg, interaction) => {
  const game = args[1];
  const time = args[2];

  await interaction.defer();
  let acc = await InteractionUtils.resolveAccount(interaction, "player", time ?? "lifetime");

  if(acc.timed != undefined) {
    Logger.info("Getting account diff");
    const tmpAcc = AccountComparitor(acc.acc, acc.timed);

    acc = tmpAcc;
  }

  if(acc == undefined || acc.name == "INVALID-NAME" || acc.miniWalls == undefined) {
    return new CommandResponse("", ERROR_UNLINKED);
  }


  const res = await BotRuntime.getStats(acc, `${game}`);
  const e = res.embed;
  const menu = await MenuGenerator.statsMenu(acc.uuid, time);
  return {
    res: "",
    embed: e,
    b: menu
  };
});
