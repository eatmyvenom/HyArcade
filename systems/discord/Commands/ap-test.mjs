import Database from "hyarcade-requests/Database.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import GameAP from "../Utils/Embeds/GameAP.js";

export default new Command(["dev-totalap"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0] ?? "!";

  let acc;
  if (interaction == undefined) {
    acc = await Database.achievements(plr, rawMsg.author.id);
  } else {
    if (interaction.isButton() || interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      acc = await Database.achievements(plr);
    } else {
      await interaction.deferReply();
      acc = await Database.achievements(interaction.options.getString("player"), interaction.user.id);
    }
  }

  const embed = GameAP(acc, args[1]);

  return new CommandResponse("", embed, undefined);
});
