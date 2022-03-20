import logger from "hyarcade-logger";
import Database from "hyarcade-requests/Database.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
export default async function NameUpdater(client) {
  logger.info("Updating usernames in mini walls discord");
  const accs = await Database.getLinkedAccounts();
  const list = await Database.readDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  const miwServer = await client.guilds.fetch("789718245015289886");
  const miwMembers = await miwServer.members.fetch();

  for (const m of miwMembers) {
    const uuid = disclist[m[1].user.id];
    if (uuid != undefined) {
      const acc = accs.find(a => a.uuid == uuid);
      if (acc != undefined && acc.name != undefined && acc.name != "INVALID-NAME" && acc.name != m.displayName) {
        try {
          await m[1].setNickname(acc.name);
        } catch (error) {
          logger.err(error);
        }
      }
    }
  }

  logger.info("Names updated!");
}
