const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("mkhook", ["156952208045375488"], async (args) => {
    const channelID = args[0];
    const channel = await BotUtils.client.channels.fetch(channelID);
    await channel.createWebhook("Arcade Bot Hook", {
        avatar: "https://cdn.discordapp.com/avatars/818719828352696320/bb430aeea67244e5c2c8ab56dad79194.webp",
    });
});
