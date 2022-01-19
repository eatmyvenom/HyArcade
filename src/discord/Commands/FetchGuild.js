const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");

module.exports = new Command("FetchGuild", ["156952208045375488"], async (args) => {
  const id = args[0];
  const guild = await BotRuntime.client.guilds.fetch(id);
  return new CommandResponse(`\`\`\`\nGuild data:\n${JSON.stringify(guild, null, 2)}\n\`\`\``);
});
