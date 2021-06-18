import Command from "../../classes/Command.js";
import BotUtils from "../BotUtils.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import { Whois as embedGen } from "../Embeds.js";

export let WhoIS = new Command("whois", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let acc;
    if(interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
    }
    let embed = embedGen(acc);
    return { res: "", embed: embed };
});
