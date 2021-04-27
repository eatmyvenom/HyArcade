const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("mkhook", ["156952208045375488"], async (args) => {
    let channelID = args[0];
    let channel = await BotUtils.client.channels.fetch(channelID);
    await channel.createWebhook("Arcade Bot Hook", {
        avatar:
            "https://cdn.discordapp.com/avatars/818719828352696320/e3d2cac7292077850196fe232f1e7efe.webp",
    });
});
