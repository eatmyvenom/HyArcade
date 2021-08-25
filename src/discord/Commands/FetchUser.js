const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("FetchUser", ["156952208045375488"], async (args) => {
  const id = args[0];
  const user = await BotUtils.client.users.fetch(id);
  return new CommandResponse(`\`\`\`\nUser data:\n${JSON.stringify(user, null, 2)}\n\`\`\``);
});
