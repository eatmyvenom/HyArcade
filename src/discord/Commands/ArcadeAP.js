const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");
const { apMenu } = require("../interactions/SelectionMenus/MenuGenerator");
const CommandResponse = require("../Utils/CommandResponse");
const ArcadeAp = require("../Utils/Embeds/ArcadeAp");

module.exports = new Command(["ap", "achievements"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0] ?? "!";

  let acc;
  if(interaction == undefined) {
    acc = await BotRuntime.resolveAccount(plr, rawMsg, args.length != 2);
  } else {
    if(interaction.isButton() || interaction.isSelectMenu()) {
      await interaction.deferUpdate();
      acc = await BotRuntime.resolveAccount(plr, undefined, false);
    } else {
      await interaction.deferReply();
      acc = await InteractionUtils.resolveAccount(interaction, "player");
    }
  }

  const embed = ArcadeAp(acc, args[1]);
  const menu = apMenu(acc.uuid, args[1]);

  return new CommandResponse("", embed, undefined, menu);
});
