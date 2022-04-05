import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { client } from "../BotRuntime.js";

export default new Command("fetchguild", ["156952208045375488"], async args => {
  const id = args[0];
  const guild = await client.guilds.fetch(id);
  return new CommandResponse(`\`\`\`\nGuild data:\n${JSON.stringify(guild, undefined, 2)}\n\`\`\``);
});
