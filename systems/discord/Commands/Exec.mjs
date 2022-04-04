import { execSync } from "node:child_process";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";

export default new Command("exec", ["156952208045375488"], async args => {
  const shellCommand = args.join(" ");
  let stdout;
  try {
    stdout = execSync(shellCommand, {
      timeout: 20000,
    });
  } catch (error) {
    stdout = error;
  }

  const res = `\`\`\`Response:\n${stdout.toString()}\n\`\`\``;

  return new CommandResponse(res);
});
