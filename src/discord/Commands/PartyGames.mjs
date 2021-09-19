import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Command = require("../../classes/Command");
const InteractionUtils = require("../interactions/InteractionUtils");
const MenuGenerator = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const PartyGamesImg = require("../images/PartyGamesImg");
const {
  ERROR_UNLINKED
} = require("../Utils/Embeds/StaticEmbeds");



export default new Command("party-games", ["*"], async (args, rawMsg, interaction) => {
  const game = args[1] ?? "Party Games";
  
  await interaction.defer();
  const acc = await InteractionUtils.resolveAccount(interaction, "player");
  
  if(acc == undefined || acc.name == "INVALID-NAME" || acc.miniWalls == undefined) {
    return new CommandResponse("", ERROR_UNLINKED);
  }
  
  const img = await PartyGamesImg(acc, game);
  const menu = await MenuGenerator.partyGamesMenu(acc.uuid);
  return new CommandResponse("", undefined, img, menu);
});