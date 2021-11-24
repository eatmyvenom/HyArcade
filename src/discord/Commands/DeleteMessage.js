const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

module.exports = new Command("delmsg", ["156952208045375488"], async (args) => {
  const channelId = args[0];
  const msgID = args[1];
  const channel = await BotRuntime.client.channels.fetch(channelId);

  const msg = await channel.messages.fetch(msgID);
  if(msg.deletable) {
    await msg.delete();
    return { res: "Message deleted!" };
  }

  return { res: "Message cannot be deleted!" };

});
