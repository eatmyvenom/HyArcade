import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { client } from "../BotRuntime.js";

export default new Command("fetchchannel", ["156952208045375488"], async args => {
  const id = args[0];
  const channel = await client.channels.fetch(id);
  // eslint-disable-next-line unicorn/no-null
  return new CommandResponse(`\`\`\`\nChannel data:\n${JSON.stringify(channel, null, 2)}\n\`\`\``);
});
