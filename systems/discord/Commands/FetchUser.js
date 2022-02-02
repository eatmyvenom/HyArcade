const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("fetchuser", ["156952208045375488"], async args => {
  const id = args[0];
  const user = await BotRuntime.client.users.fetch(id);
  return new CommandResponse(`\`\`\`\nUser data:\n${JSON.stringify(user, null, 2)}\n\`\`\``);
});
