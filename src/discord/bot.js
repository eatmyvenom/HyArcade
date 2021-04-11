const Discord = require("discord.js");
const BotUtils = require("./BotUtils");
const config = require("../../config.json");
const { addAccounts } = require("../listUtils");
const { logger, isValidIGN } = require("../utils");
const botCommands = require("./botCommands");
const BotEvents = require("./BotEvents");
const messageHandler = require("./messageHandler");

/**
 * Execute the discord bot
 *
 */
module.exports = function doBot() {
    const client = new Discord.Client();

    client.on("ready", async () => {
        BotUtils.client = client;
        await BotEvents.ready();
    });

    client.on("message", messageHandler);

    client.on("rateLimit", BotEvents.rateLimit);
    client.on("messageDelete", BotEvents.messageDelete);

    client.login(config.discord.token);
};
