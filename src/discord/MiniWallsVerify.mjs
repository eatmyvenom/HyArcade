import { createRequire } from "module";
const require = createRequire(import.meta.url);
import Logger from "hyarcade-logger";
const { mojangRequest } = require("hyarcade-requests");
import Account from "hyarcade-requests/types/Account.js";
import addAccounts from "../datagen/addAccounts.js";
import Runtime from "../Runtime.js";
import BotRuntime from "./BotRuntime.js";
const { playerLink } = require("./Utils/Embeds/AdvancedEmbeds.js");
import { ERROR_API_DOWN, ERROR_IGN_UNDEFINED, ERROR_LINK_HYPIXEL_MISMATCH_MW } from "./Utils/Embeds/StaticEmbeds.js";

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted (id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}


/**
 * @param {*} msg
 */
export default async function MiniWallsVerify (msg) {
  const {
    tag
  } = msg.author;
  const {
    id
  } = msg.author;
  const ign = msg.content.trim();
  if(await isBlacklisted(id)) return;
  const uuid = await mojangRequest.getUUID(ign);
  if(uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    await msg.channel.send({
      embeds: [ERROR_IGN_UNDEFINED]
    });
    return;
  }

  if(Runtime.fromJSON().apiDown) {
    Logger.warn("Someone tried to verify while API is down!");
    await msg.channel.send({
      embeds: [ERROR_API_DOWN]
    });
    return;
  }

  const acc = new Account(ign, 0, uuid);
  await acc.updateData();
  const dbAcc = await BotRuntime.resolveAccount(uuid, msg, false);
  const hackers = await BotRuntime.getHackerlist();
  const disclist = await BotRuntime.getFromDB("disclist");
  if(dbAcc.guildID == "608066958ea8c9abb0610f4d" || hackers.includes(uuid)) {
    Logger.warn("Hacker tried to verify!");
    return;
  }
  if(acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    await addAccounts("others", [uuid]);
    disclist[id] = uuid;
    await BotRuntime.writeToDB("disclist", disclist);
    Logger.out(`${tag} was autoverified in miniwalls as ${ign}`);
    await msg.member.roles.remove("850033543425949736");
    await msg.member.roles.add("789721304722178069");
    await msg.member.setNickname(acc.name);
    await msg.channel.send({
      embeds: [playerLink(acc.name, msg.author)]
    });
  } else {
    await msg.channel.send({
      embeds: [ERROR_LINK_HYPIXEL_MISMATCH_MW]
    });
  }
}