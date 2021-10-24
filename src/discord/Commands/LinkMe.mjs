import Account from "../../classes/account.js";
import Command from "../../classes/Command.js";
import mojangRequest from "../../request/mojangRequest.js";
import { addAccounts } from "../../listUtils.js";
import BotRuntime from "../BotRuntime.js";
import { ERROR_ACCOUNT_PREVIOUSLY_LINKED, ERROR_IGN_UNDEFINED, ERROR_INPUT_IGN, ERROR_LINK_HYPIXEL_MISMATCH, ERROR_PLAYER_PREVIOUSLY_LINKED, INFO_LINK_SUCCESS } from "../Utils/Embeds/StaticEmbeds.js";

export default new Command("verify", ["*"], async (args, rawMsg, interaction) => {
  const player = args[0];
  if (player == undefined) {
    const embed = ERROR_INPUT_IGN;
    return { res: "", embed };
  }
  await interaction.defer();
  const acclist = await BotRuntime.getFromDB("accounts");
  let acc = acclist.find(
    (a) =>
      (`${a.uuid}`).toLowerCase() == player.toLowerCase() || (`${a.name}`).toLowerCase() == player.toLowerCase()
  );
  if (acc == undefined) {
    const uuid = player.length == 32 ? player : await mojangRequest.getUUID(player);
    if ((`${uuid}`).length != 32) {
      const noexistEmbed = ERROR_IGN_UNDEFINED;

      return { res: "", embed: noexistEmbed };
    }
    acc = new Account(player, 0, uuid);
    await addAccounts("others", [uuid]);
    await acc.updateHypixel();
  }

  let tag;
  if (interaction == undefined) {
    tag = rawMsg.author.tag.toLowerCase();
  } else {
    tag = interaction.member.user.tag.toLowerCase();
  }

  if ((`${acc.hypixelDiscord}`).toLowerCase() == tag) {
    let uuid = player;
    // if its not a uuid then convert to uuid
    if (player.length < 17) {
      uuid = acc.uuid;
    }
    let discord;
    if (interaction == undefined) {
      discord = rawMsg.author.id;
    } else {
      discord = interaction.member.id;
    }
    const disclist = await BotRuntime.getFromDB("disclist");
    // make sure player isnt linked
    if (disclist[discord]) {
      const embed = ERROR_PLAYER_PREVIOUSLY_LINKED;
      return { res: "", embed };
      // make sure user isnt linked
    } else if (Object.values(disclist).find((u) => u == uuid) != undefined) {
      const embed = ERROR_ACCOUNT_PREVIOUSLY_LINKED;
      return { res: "", embed };
    }

    disclist[discord] = uuid;
    await BotRuntime.writeToDB("disclist", disclist);
    const embed = INFO_LINK_SUCCESS;
    return { res: "", embed };
  } 
  const embed = ERROR_LINK_HYPIXEL_MISMATCH;
  return { res: "", embed };
    
});
