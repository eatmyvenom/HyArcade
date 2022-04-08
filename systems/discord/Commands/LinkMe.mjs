import { Interaction, Message } from "discord.js";
import Logger from "@hyarcade/logger";
import Database from "@hyarcade/requests/Database.js";
import mojangRequest from "@hyarcade/requests/mojangRequest.js";
import { Account, Command } from "@hyarcade/structures";
import CommandResponse from "../Utils/CommandResponse.js";
import AdvancedEmbeds from "../Utils/Embeds/AdvancedEmbeds.js";
import { ERROR_IGN_UNDEFINED, ERROR_LINK_HYPIXEL_MISMATCH } from "../Utils/Embeds/StaticEmbeds.js";
import LogUtils from "../Utils/LogUtils.js";

/**
 *
 * @param {string[]} args
 * @param {Message} rawMsg
 * @param {Interaction} interaction
 * @returns {CommandResponse}
 */
async function verifyCommand(args, rawMsg, interaction) {
  let tag;
  let id;

  if (interaction) {
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
  if (uuid == undefined) {
    const noexistEmbed = ERROR_IGN_UNDEFINED;

    return new CommandResponse("", noexistEmbed);
  }

  if (uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }

  const acc = new Account(firstWord, 0, uuid);
  await acc.updateData();
  uuid = acc.uuid;

  const list = await Database.readDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  if (acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    await Database.linkDiscord(id, uuid);
    await LogUtils.logVerify(id, acc.name);
    Logger.out(`${tag} was verified as ${acc.name}`);

    try {
      await Database.addAccount(acc);
    } catch (error) {
      Logger.error(error);
    }

    return new CommandResponse("", AdvancedEmbeds.playerLink(acc.name, { id }));
  }

  return new CommandResponse("", ERROR_LINK_HYPIXEL_MISMATCH);
}

export default new Command("verify", ["*"], verifyCommand);
