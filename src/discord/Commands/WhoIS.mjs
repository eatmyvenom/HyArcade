import Command from "../../classes/Command.js";
import BotUtils from "../BotUtils.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { INFO_WHOIS } from "../Utils/Embeds/DynamicEmbeds.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";

export const WhoIS = new Command("whois", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  let acc;
  if (interaction == undefined) {
    acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction);
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }
  const embed = INFO_WHOIS(acc);
  return { res: "", embed };
});
