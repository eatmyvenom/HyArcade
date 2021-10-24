import Command from "../../classes/Command.js";
import AdvancedEmbeds from "../Utils/Embeds/AdvancedEmbeds.js";
import BotRuntime from "../BotRuntime.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

/**
 * 
 * @param {string[]} args 
 * @param {object} rawMsg 
 * @param {object} interaction 
 * @returns {object}
 */
async function compareHandler (args, rawMsg, interaction) {
  if (args.length < 3) {
    return { res: "", embed: ERROR_ARGS_LENGTH(3) };
  }

  const plr1 = args[0];
  const plr2 = args[1];
  const game = args[2];
  let acc1;
  let acc2;

  let channel;
  if (interaction == undefined) {
    acc1 = await BotRuntime.resolveAccount(plr1, rawMsg, false);
    acc2 = await BotRuntime.resolveAccount(plr2, rawMsg, false);
    channel = rawMsg.channel;
  } else {
    await interaction.defer();
    acc1 = await InteractionUtils.resolveAccount(interaction, "player1");
    acc2 = await InteractionUtils.resolveAccount(interaction, "player2");
    channel = interaction.channel;
  }

  let hasEmojiPerms = false;

  if(channel.permissionsFor(channel.guild.roles.everyone).has("USE_EXTERNAL_EMOJIS")) hasEmojiPerms = true;

  const embed = AdvancedEmbeds.compareStats(acc1, acc2, game, hasEmojiPerms);
  return { res: "", embed };
}

export default new Command("compare", ["*"], compareHandler, 10000);
