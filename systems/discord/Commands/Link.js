const Database = require("hyarcade-requests/Database");
const { addAccount } = require("hyarcade-requests/Database");
const mojangRequest = require("hyarcade-requests/mojangRequest");
const Account = require("hyarcade-requests/types/Account");
const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");
const { ERROR_IGN_UNDEFINED, INFO_LINK_SUCCESS, ERROR_PLAYER_PREVIOUSLY_LINKED, ERROR_ACCOUNT_PREVIOUSLY_LINKED } = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command(["link", "ln"], ["%trusted%"], async args => {
  if (args.length === 0) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }
  let player = args[0];
  let discord = args[1];
  const list = await BotRuntime.getFromDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  if (`${player}`.startsWith("https://")) {
    const channelID = player.slice(player.lastIndexOf("/") - 18, player.lastIndexOf("/"));
    const msgID = player.slice(player.lastIndexOf("/") + 1);

    const channel = await BotRuntime.client.channels.fetch(channelID);
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
  await addAccount([acc]);

  uuid = acc.uuid;

  if (args.includes("-f")) {
    await Database.linkDiscord(discord, uuid);
    const embed = INFO_LINK_SUCCESS;
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

  await Database.linkDiscord(discord, uuid);
  const embed = INFO_LINK_SUCCESS;
  return {
    res: "",
    embed,
  };
});
