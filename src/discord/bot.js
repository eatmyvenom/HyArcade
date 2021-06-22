const Discord = require("discord.js");
const BotUtils = require("./BotUtils");
const config = require("../Config").fromJSON();
const Runtime = require("../Runtime").fromJSON();
const BotEvents = require("./BotEvents");
const messageHandler = require("./messageHandler");
const { logger } = require("../utils");

const requiredIntents = [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
];

/**
 * Execute the discord bot
 *
 */
module.exports = function doBot() {
    let mode = process.argv[3];
    const client = new Discord.Client({
        intents: requiredIntents,
        allowedMentions: { parse: [], repliedUser: false },
    });

    client.on("ready", async () => {
        BotUtils.client = client;
        await BotEvents.ready(mode);
    });

    client.on("rateLimit", BotEvents.rateLimit);

    if (mode == undefined || mode == "mw") {
        client.on("message", messageHandler);
        client.on("messageDelete", BotEvents.messageDelete);
        setInterval(BotEvents.tick, 10000);
    }

    if (Runtime.bot != "backup") {
        logger.info("Logging in to discord");
        client.login(config.discord.token);
    } else {
        logger.info("Logging in to discord as backup");
        client.login(config.discord.backupToken);
    }

    setInterval(BotEvents.dataRefresh, 30000);
    setInterval(BotEvents.heartBeat, 900000);
};
