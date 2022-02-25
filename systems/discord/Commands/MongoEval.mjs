import Database from "hyarcade-requests/Database.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { inspect } from "node:util";

export default new Command("mongoeval", ["156952208045375488"], async args => {
  let evaled = await Database.internal({ mongoEval: args.join(" ") });

  if (typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }

  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
