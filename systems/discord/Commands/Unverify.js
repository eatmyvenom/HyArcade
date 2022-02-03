const { Interaction } = require("discord.js");
const Database = require("hyarcade-requests/Database");
const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

/**
 *
 * @param {*} args
 * @param {*} rawMsg
 * @param {Interaction} interaction
 * @returns {CommandResponse}
 */
async function unverify(args, rawMsg, interaction) {
  const list = await BotRuntime.getFromDB("discordList");
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

module.exports = new Command(["unlink", "unverify"], ["*"], unverify);
