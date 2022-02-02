const cp = require("child_process");
const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");

module.exports = new Command("exec", ["156952208045375488"], async args => {
  const shellCommand = args.join(" ");
  let stdout;
  try {
    stdout = cp.execSync(shellCommand, {
      timeout: 20000,
    });
  } catch (error) {
    stdout = error;
  }

  const res = `\`\`\`Response:\n${stdout.toString()}\n\`\`\``;

  return new CommandResponse(res);
});
