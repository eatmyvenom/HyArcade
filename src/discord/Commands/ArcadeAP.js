const Command = require("../../classes/Command");
const { apMenu } = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const Database = require("../Utils/Database");
const ArcadeAp = require("../Utils/Embeds/ArcadeAp");

module.exports = new Command(["ap", "achievements", "arcade-ap", "aap"], ["*"], async (args, rawMsg, interaction) => {
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
  const menu = apMenu(acc.uuid, args[1]);

  return new CommandResponse("", embed, undefined, menu);
});
