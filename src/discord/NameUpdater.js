import { Client } from "discord.js";
import logger from "hyarcade-logger";
import BotUtils from "./BotUtils";

/**
 * @param {Client} client
 */
export default async function NameUpdater (client) {
  const accs = BotUtils.getFromDB("accounts");

  const mwServer = await client.guilds.fetch("789718245015289886");
  const mwMembers = await mwServer.members.fetch();

  mwMembers.forEach(async (m) => {
    const acc = accs.find((a) => a.discord = m.id);
    if(acc != undefined && (acc.name != m.nickname || acc.name != m.user.username)) {
      try {
        await m.setNickname(acc.name);
      } catch (e) {
        logger.err(e);
      }
    }
  });
}