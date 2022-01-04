import Account from "../../classes/account.js";
import Command from "../../classes/Command.js";
import mojangRequest from "../../request/mojangRequest.js";
import BotRuntime from "../BotRuntime.js";
import { ERROR_IGN_UNDEFINED,  ERROR_LINK_HYPIXEL_MISMATCH } from "../Utils/Embeds/StaticEmbeds.js";
import Database from "../Utils/Database.js";
import Logger from "hyarcade-logger";
import { Interaction, Message } from "discord.js";
import CommandResponse from "../Utils/CommandResponse.js";
import AdvancedEmbeds from "../Utils/Embeds/AdvancedEmbeds.js";

/**
 * 
 * @param {string[]} args 
 * @param {Message} rawMsg 
 * @param {Interaction} interaction 
 * @returns {CommandResponse}
 */
async function verifyCommand (args, rawMsg, interaction) {
  let tag;
  let id;

  if(interaction) {
    await interaction.deferReply();
    tag = interaction.user.tag;
    id = interaction.user.id;
  } else {
    tag = rawMsg.author.tag;
    id = rawMsg.author.id;
  }

  const firstWord = args[0];

  let uuid;

  uuid = firstWord.length == 32 ? firstWord : await mojangRequest.getUUID(firstWord);
  if((`${uuid}`).length != 32) {
    const noexistEmbed = ERROR_IGN_UNDEFINED;

    return new CommandResponse(noexistEmbed);
  }

  if(uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }

  const acc = new Account(firstWord, 0, uuid);
  await acc.updateData();
  uuid = acc.uuid;

  const disclist = await BotRuntime.getFromDB("disclist");
  
  if(acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    disclist[id] = uuid;
    Logger.out(`${tag} was verified as ${acc.name}`);
    
    await Database.addAccount(acc);
    await BotRuntime.writeToDB("disclist", disclist);

    return new CommandResponse("", AdvancedEmbeds.playerLink(acc.name, { id }));
  }

  return new CommandResponse(`${firstWord} - ${uuid} - ${acc.hypixelDiscord} - ${acc.level} - ${tag}`, ERROR_LINK_HYPIXEL_MISMATCH);
}

export default new Command("verify", ["*"], verifyCommand);
