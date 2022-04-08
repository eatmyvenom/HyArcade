import Logger from "@hyarcade/logger";
import Database from "@hyarcade/database";
import { Account } from "@hyarcade/structures";
import { createRequire } from "node:module";
import addAccounts from "../../datagen/addAccounts.js";
import BotRuntime from "../BotRuntime.js";
import { ERROR_IGN_UNDEFINED, ERROR_LINK_HYPIXEL_MISMATCH_MW } from "./Embeds/StaticEmbeds.js";
import LogUtils from "./LogUtils.mjs";
const require = createRequire(import.meta.url);
const { mojangRequest } = require("@hyarcade/requests");
const { playerLink } = require("./Embeds/AdvancedEmbeds.js");

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted(id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 * @param {*} msg
 */
export default async function MiniWallsVerify(msg) {
  const { tag } = msg.author;
  const { id } = msg.author;
  const ign = msg.content.trim();
  if (await isBlacklisted(id)) return;
  const uuid = await mojangRequest.getUUID(ign);
  if (uuid == undefined) {
    Logger.warn("Someone tried to verify as an account that doesn't exist!");
    await msg.channel.send({
      embeds: [ERROR_IGN_UNDEFINED],
    });
    return;
  }

  const acc = new Account(ign, 0, uuid);
  await acc.updateData();
  const dbAcc = await Database.account(uuid, id);
  const hackers = await BotRuntime.getHackerlist();
  if (dbAcc.guildID == "608066958ea8c9abb0610f4d" || hackers.includes(uuid)) {
    Logger.warn("Hacker tried to verify!");
    return;
  }
  if (acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    await addAccounts([uuid]);
    await Database.linkDiscord(id, uuid);
    await LogUtils.logVerify(id, acc.name);
    Logger.out(`${tag} was autoverified in miniwalls as ${ign}`);
    await msg.member.roles.remove("850033543425949736");
    await msg.member.roles.add("789721304722178069");
    await msg.member.setNickname(acc.name);
    await msg.channel.send({
      embeds: [playerLink(acc.name, msg.author)],
    });
  } else {
    await msg.channel.send({
      embeds: [ERROR_LINK_HYPIXEL_MISMATCH_MW],
    });
  }
}
