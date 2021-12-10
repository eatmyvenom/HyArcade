const Logger = require("hyarcade-logger");
const { mojangRequest } = require("hyarcade-requests");
const Account = require("hyarcade-requests/types/Account.js");
const BotRuntime = require("./BotRuntime.js");
const { playerLink } = require("./Utils/Embeds/AdvancedEmbeds.js");
const { Message } = require("discord.js");
const { ERROR_IGN_UNDEFINED, ERROR_LINK_HYPIXEL_MISMATCH_AUTO } = require("./Utils/Embeds/StaticEmbeds.js");
const isValidIGN = require("../datagen/utils/ignValidator.js");

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted (id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}


/**
 * @param {Message} msg
 * @param {string} roleidAdd
 * @param {string} roleidRemove
 */
module.exports = async function VerifyChannel (msg, roleidAdd, roleidRemove) {
  const { tag, id } = msg.author;

  if(await isBlacklisted(id)) return;

  const firstWord = msg.content.split(" ")[0];
  if(msg.author.bot || !isValidIGN(firstWord)) {
    return;
  }

  const uuid = await mojangRequest.getUUID(firstWord);

  if(uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    await msg.channel.send({
      embeds: [ERROR_IGN_UNDEFINED]
    });
    return;
  }

  const acc = new Account(firstWord, 0, uuid);
  await acc.updateData();
  const disclist = await BotRuntime.getFromDB("disclist");

  if(acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    disclist[id] = uuid;

    Logger.out(`${tag} was autoverified in ${msg.guild.name} as ${acc.name}`);

    await msg.channel.send({
      embeds: [playerLink(acc.name, msg.author)]
    });

    try {
      if(roleidAdd != "") {
        await msg.member.roles.add(roleidAdd);
      }
      
      if(roleidRemove != "") {
        await msg.member.roles.remove(roleidRemove);
      }
      
      await msg.member.setNickname(acc.name);
    } catch (e) {
      Logger.err("Linking error!");
      Logger.err(e);
    }
    await BotRuntime.writeToDB("disclist", disclist);
  } else {
    await msg.channel.send({
      embeds: [ERROR_LINK_HYPIXEL_MISMATCH_AUTO]
    });
  }
};