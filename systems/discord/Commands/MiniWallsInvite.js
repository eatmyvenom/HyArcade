const { Message } = require("discord.js");
const Command = require("@hyarcade/structures/Discord/Command");
const CommandResponse = require("../Utils/CommandResponse");

/**
 *
 * @param {string[]} args
 * @param {Message} rawMsg
 * @returns {Promise<CommandResponse>}
 */
async function miniWallsInvite(args, rawMsg) {
  const invite = await rawMsg.guild.invites.create("791122377333407784", {
    temporary: true,
    maxAge: 43200,
    maxUses: 1,
    unique: true,
    reason: `${rawMsg.author.username} (${rawMsg.author.id}) requested invite!`,
  });

  const dmChannel = await rawMsg.author.createDM();
  await dmChannel.send({ content: invite.url });

  return new CommandResponse("Invite sent to you in DMs!");
}

module.exports = new Command("miniwallsinvite", ["*"], miniWallsInvite, 20000);
