const Discord = require("discord.js");
const BotUtils = require("./BotUtils");
const config = require("../Config").fromJSON();
const Runtime = require("../Runtime").fromJSON();
const BotEvents = require("./BotEvents");
const messageHandler = require("./messageHandler");

const requiredIntents = [Discord.Intents.FLAGS.GUILDS,
                            Discord.Intents.FLAGS.GUILD_MESSAGES,
                            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
                            Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
                            GUILD_MEMBERS]

/**
 * Execute the discord bot
 *
 */
module.exports = function doBot() {
    let mode = process.argv[3];
    const client = new Discord.Client({
        intents: requiredIntents,
        allowedMentions: { parse: ["users", "roles"], repliedUser: false },
    });

    client.on("ready", async () => {
        BotUtils.client = client;
        await BotEvents.ready(mode);
    });

    client.on("rateLimit", BotEvents.rateLimit);

    if (mode == undefined) {
        client.on("message", messageHandler);
        client.on("messageDelete", BotEvents.messageDelete);
    }

    if (Runtime.bot != "backup") {
        client.login(config.discord.token);
    } else {
        client.login(config.discord.backupToken);
    }

    setInterval(BotEvents.tick, 5000);
    setInterval(BotEvents.heartBeat, 3600000);
};
