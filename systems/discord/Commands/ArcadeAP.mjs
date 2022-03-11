import Database from "hyarcade-requests/Database.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import ArcadeAPMenu from "../interactions/Components/Menus/Generators/ArcadeAPMenu.js";
import ArcadeAp from "../Utils/Embeds/ArcadeAp.js";

export default new Command(["ap", "achievements", "arcade-ap", "aap"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0] ?? "!";

  let acc;
  if (interaction == undefined) {
    acc = await Database.account(plr, rawMsg.author.id);
  } else {
    if (interaction.isButton() || interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      acc = await Database.account(plr);
    } else {
      await interaction.deferReply();
      acc = await Database.account(interaction.options.getString("player"), interaction.user.id);
    }
  }

  const embed = ArcadeAp(acc, args[1]);
  const menu = ArcadeAPMenu(acc.uuid, args[1]);

  return new CommandResponse("", embed, undefined, menu);
});
