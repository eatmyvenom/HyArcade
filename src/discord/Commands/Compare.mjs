import Command from "../../classes/Command.js";
import AdvancedEmbeds from "../Utils/Embeds/AdvancedEmbeds.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";
import Database from "../Utils/Database.js";

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
    acc1 = await Database.account(plr1, rawMsg.author.id);
    acc2 = await Database.account(plr2, rawMsg.author.id);
    channel = rawMsg.channel;
  } else {
    await interaction.deferReply();
    acc1 = await Database.account(interaction.options.getString("player1"), interaction.user.id);
    acc2 = await Database.account(interaction.options.getString("player2"), interaction.user.id);
    channel = interaction.channel;
  }

  let hasEmojiPerms = false;

  if(channel.permissionsFor(channel.guild.roles.everyone).has("USE_EXTERNAL_EMOJIS")) hasEmojiPerms = true;

  const embed = AdvancedEmbeds.compareStats(acc1, acc2, game, hasEmojiPerms);
  return { res: "", embed };
}

export default new Command("compare", ["*"], compareHandler, 10000);
