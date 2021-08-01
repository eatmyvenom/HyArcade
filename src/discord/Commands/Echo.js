const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("echo", ["%trusted%"], async (args, rawMsg) => {
    let channel = args[0];
    let text;
    let discChannel;
    if(channel.length == 18 && channel.toLowerCase() == channel.toUpperCase()) {
        discChannel = await BotUtils.client.channels.fetch(args[0]);
        text = args.slice(1).join(" ");
    } else {
        discChannel = rawMsg.channel;
        text = args.join(" ");
    }

    await discChannel.send(text);
    return new CommandResponse("Message sent!", undefined, undefined, undefined, true);
});