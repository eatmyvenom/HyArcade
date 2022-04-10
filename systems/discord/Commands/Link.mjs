import { Account } from "@hyarcade/account";
import { addAccount, linkDiscord, readDB } from "@hyarcade/database";
import Logger from "@hyarcade/logger";
import { mojangRequest } from "@hyarcade/requests";
import Command from "@hyarcade/structures/Discord/Command.js";
import { client } from "../BotRuntime.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";
import {
  ERROR_ACCOUNT_PREVIOUSLY_LINKED,
  ERROR_IGN_UNDEFINED,
  ERROR_PLAYER_PREVIOUSLY_LINKED,
  INFO_LINK_SUCCESS,
} from "../Utils/Embeds/StaticEmbeds.js";
import LogUtils from "../Utils/LogUtils.mjs";

export default new Command(["link", "ln"], ["%trusted%"], async args => {
  if (args.length === 0) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }
  let player = args[0];
  let discord = args[1];
  const list = await readDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  if (`${player}`.startsWith("https://")) {
    const channelID = player.slice(player.lastIndexOf("/") - 18, player.lastIndexOf("/"));
    const msgID = player.slice(player.lastIndexOf("/") + 1);

    const channel = await client.channels.fetch(channelID);
    const msg = await channel.messages.fetch(msgID);

    discord = msg.author.id;
    player = msg.content;
  }

  let uuid;

  uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
  if (`${uuid}`.length != 32) {
    const noexistEmbed = ERROR_IGN_UNDEFINED;

    return {
      res: "",
      embed: noexistEmbed,
    };
  }

  const acc = new Account(player, 0, uuid);
  await acc.updateHypixel();
  try {
    await addAccount(acc);
  } catch (error) {
    Logger.error(error);
  }

  uuid = acc.uuid;

  if (args.includes("-f")) {
    await linkDiscord(discord, uuid);
    const embed = INFO_LINK_SUCCESS;

    await LogUtils.logVerify(discord, acc.name);

    return {
      res: "",
      embed,
    };
  }

  if (disclist[discord]) {
    const embed = ERROR_PLAYER_PREVIOUSLY_LINKED;
    return {
      res: "",
      embed,
    };
  } else if (Object.values(disclist).some(u => u == uuid)) {
    const embed = ERROR_ACCOUNT_PREVIOUSLY_LINKED;
    return {
      res: "",
      embed,
    };
  }

  await LogUtils.logVerify(discord, acc.name);
  await linkDiscord(discord, uuid);
  const embed = INFO_LINK_SUCCESS;
  return {
    res: "",
    embed,
  };
});
