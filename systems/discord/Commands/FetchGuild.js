const Command = require("@hyarcade/structures/Discord/Command");
const CommandResponse = require("@hyarcade/structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("FetchGuild", ["156952208045375488"], async args => {
  const id = args[0];
  const guild = await BotRuntime.client.guilds.fetch(id);
  // eslint-disable-next-line unicorn/no-null
  return new CommandResponse(`\`\`\`\nGuild data:\n${JSON.stringify(guild, null, 2)}\n\`\`\``);
});
