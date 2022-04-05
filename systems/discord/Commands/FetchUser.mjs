import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { client } from "../BotRuntime.js";

export default new Command("fetchuser", ["156952208045375488"], async args => {
  const id = args[0];
  const user = await client.users.fetch(id);
  // eslint-disable-next-line unicorn/no-null
  return new CommandResponse(`\`\`\`\nUser data:\n${JSON.stringify(user, null, 2)}\n\`\`\``);
});
