const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("DelMsg", ["156952208045375488"], async (args) => {
    let channelId = args[0];
    let msgID = args[1];
    let channel = await BotUtils.client.channels.fetch(channelId);

    let msg = await channel.messages.fetch(msgID);
    if(msg.deletable) {
        await msg.delete();
        return {
            res: "Message deleted!"
        };
    } 
    return {
        res: "Message cannot be deleted!"
    };
    
});
