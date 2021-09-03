const Command = require("../../classes/Command");
const Logger = require("hyarcade-logger");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const {
  ERROR_UNLINKED
} = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("stats", ["*"], async (args, rawMsg, interaction) => {
  const game = args[1];
  
  await interaction.defer();
  const acc = await InteractionUtils.resolveAccount(interaction, "player");
  
  if(acc == undefined || acc.name == "INVALID-NAME" || acc.miniWalls == undefined) {
    return new CommandResponse("", ERROR_UNLINKED);
  }
  
  const res = await BotRuntime.getStats(acc, `${game}`);
  const e = res.embed;
  Logger.debug("Adding stats menu to message");
  const menu = await MenuGenerator.statsMenu(acc.uuid);
  return {
    res: "",
    embed: e,
    b: menu
  };
});
