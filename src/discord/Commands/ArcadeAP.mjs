import Command from "../../classes/Command.js";
import MenuGenerator from "../interactions/SelectionMenus/MenuGenerator.js";
import CommandResponse from "../Utils/CommandResponse.js";
import Database from "../Utils/Database.js";
import ArcadeAp from "../Utils/Embeds/ArcadeAp.js";

export default new Command(["ap", "achievements", "arcade-ap", "aap"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0] ?? "!";

  let acc;
  if(interaction == undefined) {
    acc = await Database.account(plr, rawMsg.author.id);
  } else {
    if(interaction.isButton() || interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      acc = await Database.account(plr);
    } else {
      await interaction.deferReply();
      acc = await Database.account(interaction.options.getString("player"), interaction.user.id);
    }
  }

  const embed = ArcadeAp(acc, args[1]);
  const menu = MenuGenerator.apMenu(acc.uuid, args[1]);

  return new CommandResponse("", embed, undefined, menu);
});
