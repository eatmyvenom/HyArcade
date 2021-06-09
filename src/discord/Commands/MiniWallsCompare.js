const Command = require("../../classes/Command");
const AdvancedEmbeds = require("../AdvancedEmbeds");
const BotUtils = require("../BotUtils");
const { errLen } = require("../Embeds");
const InteractionUtils = require("../interactions/InteractionUtils");

module.exports = new Command("compare", ["*"], async (args, rawMsg, interaction) => {
    if(args.length < 2) {
        return {res : "", embed:  errLen(2)};
    }

    let plr1 = args[0];
    let plr2 = args[1];
    let acc1, acc2;
    if (interaction == undefined) {
        acc1 = await BotUtils.resolveAccount(plr1, rawMsg, false);
        acc2 = await BotUtils.resolveAccount(plr2, rawMsg, false);
    } else {
        acc1 = await InteractionUtils.resolveAccount(interaction, 0);
        acc2 = await InteractionUtils.resolveAccount(interaction, 1);
    }
    let embed = AdvancedEmbeds.compareStats(acc1, acc2, "mw");
    return { res: "", embed: embed };
});
