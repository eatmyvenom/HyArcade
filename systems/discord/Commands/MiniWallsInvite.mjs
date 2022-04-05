import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "../Utils/CommandResponse.js";

/**
 *
 * @param {string[]} args
 * @param {object} rawMsg
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

export default new Command("miniwallsinvite", ["*"], miniWallsInvite, 20000);
