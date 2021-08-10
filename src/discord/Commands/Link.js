const Account = require("../../classes/account");
const Command = require("../../classes/Command");
const mojangRequest = require("../../request/mojangRequest");
const BotUtils = require("../BotUtils");
const {
  addAccount
} = require("../Utils/Database");
const {
  ERROR_ARGS_LENGTH
} = require("../Utils/Embeds/DynamicEmbeds");
const {
  ERROR_IGN_UNDEFINED,
  INFO_LINK_SUCCESS,
  ERROR_PLAYER_PREVIOUSLY_LINKED,
  ERROR_ACCOUNT_PREVIOUSLY_LINKED
} = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("link", ["%trusted%"], async (args) => {
  if(args.length < 1) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1)
    };
  }
  let player = args[0];
  let discord = args[1];
  let disclist = await BotUtils.getFromDB("disclist");

  if((`${player}`).startsWith("https://")) {
    const channelID = player.slice(player.lastIndexOf("/") - 18, player.lastIndexOf("/"));
    const msgID = player.slice(player.lastIndexOf("/") + 1);

    const channel = await BotUtils.client.channels.fetch(channelID);
    const msg = await channel.messages.fetch(msgID);

    discord = msg.author.id;
    player = msg.content;
  }

  let uuid;
  let acc;

  const acclist = await BotUtils.getFromDB("accounts");
  if(player.length < 17) {
    acc = acclist.find((a) => (`${a.name}`).toLowerCase() == player.toLowerCase());
  } else {
    acc = acclist.find((a) => (`${a.uuid}`).toLowerCase() == player.toLowerCase());
  }

  if(acc == undefined) {
    uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
    if((`${uuid}`).length != 32) {
      const noexistEmbed = ERROR_IGN_UNDEFINED;

      return {
        res: "",
        embed: noexistEmbed
      };
    }
    acc = new Account(player, 0, uuid);
    await acc.updateHypixel();
    await addAccount([acc]);
  }

  uuid = acc.uuid;

  if(args.includes("-f")) {
    disclist[discord] = uuid;
    await BotUtils.writeToDB("disclist", disclist);
    disclist = null;
    const embed = INFO_LINK_SUCCESS;
    return {
      res: "",
      embed
    };
  }

  if(disclist[discord]) {
    const embed = ERROR_PLAYER_PREVIOUSLY_LINKED;
    return {
      res: "",
      embed
    };
  } else if(Object.values(disclist).find((u) => u == uuid) != undefined) {
    const embed = ERROR_ACCOUNT_PREVIOUSLY_LINKED;
    return {
      res: "",
      embed
    };
  }

  disclist[discord] = uuid;
  await BotUtils.writeToDB("disclist", disclist);
  disclist = null;
  const embed = INFO_LINK_SUCCESS;
  return {
    res: "",
    embed
  };
});
