const Discord = require("discord.js");
const BotUtils = require("./BotUtils");
const config = require("../Config").fromJSON();
const Runtime = require("../Runtime").fromJSON();
const BotEvents = require("./BotEvents");
const messageHandler = require("./messageHandler");
const { logger } = require("../utils");

const fullIntents = [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
];

const lesserIntents = [
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILDS,
];

/**
 * Execute the discord bot
 *
 */
module.exports = function doBot() {
    let mode = process.argv[3];
    let client;
    if(mode == "mini") {
        client = new Discord.Client({
            intents: lesserIntents,
            allowedMentions: { parse: [], repliedUser: false },
        });
    } else if(mode == "mw") {
        client = new Discord.Client({
            intents: lesserIntents,
            allowedMentions: { parse: [], repliedUser: false },
        });
    } else {
        client = new Discord.Client({
            intents: fullIntents,
            allowedMentions: { parse: [], repliedUser: false },
        });
    }

    client.on("ready", async () => {
        BotUtils.client = client;
        await BotEvents.ready(mode);
    });

    client.on("rateLimit", BotEvents.rateLimit);
    client.on("warn", BotEvents.warn);
    client.on("invalidated", BotEvents.invalidated);
    client.on("guildCreate", BotEvents.guildCreate);
    client.on("error", BotEvents.error);
    client.on("webhookUpdate", BotEvents.webhookUpdate);
    client.on("guildUnavailable", BotEvents.guildUnavailable);
    client.on("invalidRequestWarning", BotEvents.invalidRequestWarning);
    client.on("debug", BotEvents.debug);

    if (mode == undefined || mode == "mw" || mode == "test") {
        logger.debug("Registering message event");
        client.on("messageCreate", messageHandler);
        client.on("messageDelete", BotEvents.messageDelete);
        setInterval(BotEvents.tick, 30000);
    }

    if (Runtime.bot != "backup") {
        if(mode == "mini") {
            logger.info("Logging in to micro arcade module");
            client.login(config.discord.miniToken);
        } else if (mode == "mw") {
            logger.info("Logging in to mini walls module");
            client.login(config.discord.mwToken);
        } else if (mode == "test") {
            logger.info("Logging in to testing bot");
            client.login(config.discord.testToken);
        } else {
            logger.info("Logging in to arcade bot");
            client.login(config.discord.token);
        }
    } else {
        logger.info("Logging in to discord as backup");
        client.login(config.discord.backupToken);
    }

    setInterval(BotEvents.cyclePresence, 7200000)
    setInterval(BotEvents.heartBeat, 900000);
};
