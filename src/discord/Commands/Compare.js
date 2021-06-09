const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");
const AdvancedEmbeds = require("../AdvancedEmbeds");
const BotUtils = require("../BotUtils");
const { errLen } = require("../Embeds");
const InteractionUtils = require("../interactions/InteractionUtils");

module.exports = new Command("compare", ["*"], async (args, rawMsg, interaction) => {
    if(args.length < 3) {
        return {res : "", embed:  errLen(3)};
    }

    let plr1 = args[0];
    let plr2 = args[1];
    let game = args[2];
    let acc1, acc2;
    if (interaction == undefined) {
        acc1 = await BotUtils.resolveAccount(plr1, rawMsg, false);
        acc2 = await BotUtils.resolveAccount(plr2, rawMsg, false);
    } else {
        acc1 = await InteractionUtils.resolveAccount(interaction, 0);
        acc2 = await InteractionUtils.resolveAccount(interaction, 1);
    }
    let embed = AdvancedEmbeds.compareStats(acc1, acc2, game);
    return { res: "", embed: embed };
});
