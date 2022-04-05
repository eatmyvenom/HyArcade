import { Database } from "@hyarcade/requests";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Interaction } = require("discord.js");

/**
 *
 * @param {*} args
 * @param {*} rawMsg
 * @param {Interaction} interaction
 * @returns {CommandResponse}
 */
async function unverify(args, rawMsg, interaction) {
  const list = await Database.readDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  if (Object.keys(disclist).includes(interaction.user.id)) {
    await Database.unlinkDiscord(interaction.user.id, interaction.user.id);

    return new CommandResponse("You were successfully unverified!");
  }

  return new CommandResponse("You are not verified and therefore cannot unverify yourself!");
}

export default new Command(["unlink", "unverify"], ["*"], unverify);
