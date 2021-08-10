const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("getDataRaw", ["*"], async (args, rawMsg) => {
  const plr = args[0];
  const acc = await BotUtils.resolveAccount(plr, rawMsg);
  const embed = new MessageEmbed()
    .setTitle(`${acc.name} IGN history`)
    .setDescription(([].concat(acc.nameHist)).join("\n"))
    .setColor(0x44a3e7);
  return {
    res: "",
    embed
  };
});
