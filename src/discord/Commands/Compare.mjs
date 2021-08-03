import Command from "../../classes/Command.js";
import AdvancedEmbeds from "../Utils/Embeds/AdvancedEmbeds.js";
import BotUtils from "../BotUtils.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export let Compare = new Command("compare", ["*"], async (args, rawMsg, interaction) => {
    if (args.length < 3) {
        return { res: "", embed: ERROR_ARGS_LENGTH(3) };
    }

    let plr1 = args[0];
    let plr2 = args[1];
    let game = args[2];
    let acc1, acc2, channel;
    if (interaction == undefined) {
        acc1 = await BotUtils.resolveAccount(plr1, rawMsg, false);
        acc2 = await BotUtils.resolveAccount(plr2, rawMsg, false);
        channel = rawMsg.channel;
    } else {
        acc1 = await InteractionUtils.resolveAccount(interaction, "player1");
        acc2 = await InteractionUtils.resolveAccount(interaction, "player2");
        channel = interaction.channel;
    }

    let hasEmojiPerms = false;

    if(!interaction && channel.permissionsFor(BotUtils.client.user).has("USE_EXTERNAL_EMOJIS")) hasEmojiPerms = true;

    let embed = AdvancedEmbeds.compareStats(acc1, acc2, game, hasEmojiPerms);
    return { res: "", embed: embed };
});
