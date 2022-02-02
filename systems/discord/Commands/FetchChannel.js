const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("FetchChannel", ["156952208045375488"], async args => {
  const id = args[0];
  const channel = await BotRuntime.client.channels.fetch(id);
  return new CommandResponse(`\`\`\`\nChannel data:\n${JSON.stringify(channel, null, 2)}\n\`\`\``);
});
