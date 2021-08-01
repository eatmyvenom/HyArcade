const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("FetchChannel", ["156952208045375488"], async (args) => {
    let id = args[0];
    let channel = await BotUtils.client.channels.fetch(id);
    return new CommandResponse("```\nChannel data:\n" + JSON.stringify(channel, null, 4) + "\n```");
});
