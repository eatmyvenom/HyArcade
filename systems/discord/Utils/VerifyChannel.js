const { Message } = require("discord.js");
const Logger = require("@hyarcade/logger");
const { mojangRequest } = require("@hyarcade/requests");
const Database = require("@hyarcade/requests/Database");
const { Account } = require("@hyarcade/structures");
const BotRuntime = require("../BotRuntime.js");
const { playerLink } = require("./Embeds/AdvancedEmbeds.js");
const { ERROR_IGN_UNDEFINED, ERROR_LINK_HYPIXEL_MISMATCH_AUTO } = require("./Embeds/StaticEmbeds.js");
const isValidIGN = require("../../datagen/utils/ignValidator.js");
const LogUtils = require("./LogUtils.js");

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted(id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 * @param {Message} msg
 * @param {string} roleidAdd
 * @param {string} roleidRemove
 */
module.exports = async function VerifyChannel(msg, roleidAdd, roleidRemove) {
  const { tag, id, bot: isBot } = msg.author;

  if (await isBlacklisted(id)) return;

  const firstWord = msg.content.split(" ")[0];
  if (isBot || !isValidIGN(firstWord)) {
    return;
  }

  const uuid = await mojangRequest.getUUID(firstWord);

  if (uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    await msg.channel.send({
      embeds: [ERROR_IGN_UNDEFINED],
    });
    return;
  }

  const acc = new Account(firstWord, 0, uuid);
  await acc.updateData();

  if (acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    await Database.linkDiscord(id, uuid);
    await LogUtils.logVerify(id, acc.name);

    Logger.out(`${tag} was autoverified in ${msg.guild.name} as ${acc.name}`);

    await msg.channel.send({
      embeds: [playerLink(acc.name, msg.author)],
    });

    try {
      if (roleidAdd != "") {
        await msg.member.roles.add(roleidAdd);
      }

      if (roleidRemove != "") {
        await msg.member.roles.remove(roleidRemove);
      }

      await msg.member.setNickname(acc.name);
    } catch (error) {
      Logger.err("Linking error!");
      Logger.err(error);
    }
    await Database.addAccount(acc);
  } else {
    await msg.channel.send({
      embeds: [ERROR_LINK_HYPIXEL_MISMATCH_AUTO],
    });
  }
};
