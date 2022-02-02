const { Interaction } = require("discord.js");
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
  let disclist = await BotRuntime.getFromDB("disclist");

  if (Object.keys(disclist).includes(interaction.user.id)) {
    disclist[interaction.user.id] = undefined;
    await BotRuntime.writeToDB("disclist", disclist);

    return new CommandResponse("You were successfully unverified!");
  }

  return new CommandResponse("You are not verified and therefore cannot unverify yourself!");
}

module.exports = new Command(["unlink", "unverify"], ["*"], unverify);
