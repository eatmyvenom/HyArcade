const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("FetchGuild", ["156952208045375488"], async (args) => {
    let id = args[0];
    let guild = await BotUtils.client.guilds.fetch(id);
    return new CommandResponse("```\nGuild data:\n" + JSON.stringify(guild, null, 4) + "\n```");
});