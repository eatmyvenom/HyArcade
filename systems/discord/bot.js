const process = require("process");
const Discord = require("discord.js");
const config = require("@hyarcade/config").fromJSON();
const logger = require("@hyarcade/logger");
const BotEvents = require("./BotEvents");
const BotRuntime = require("./BotRuntime");

const fullIntents = [
  Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
  Discord.Intents.FLAGS.GUILD_MEMBERS,
];

const lesserIntents = [Discord.Intents.FLAGS.GUILDS];

const miwIntents = [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS];

/**
 * Execute the discord bot
 *
 */
function doBot() {
  logger.name = "Bot";
  const mode = process.argv[3];
  let client;
  if (mode == "mini") {
    client = new Discord.Client({
      intents: lesserIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else if (mode == "mw") {
    client = new Discord.Client({
      intents: miwIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else if (mode == "slash") {
    client = new Discord.Client({
      intents: lesserIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else {
    client = new Discord.Client({
      intents: fullIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  }

  client.on("ready", async () => {
    BotRuntime.client = client;
    await BotEvents.ready(mode);

    if (mode == undefined || mode == "mw" || mode == "test") {
      client.on("messageDelete", BotEvents.messageDelete);

      logger.debug("Registering message event");
      const messageHandler = await import("./messageHandler.mjs");
      client.on("messageCreate", msg => {
        messageHandler.default(msg).catch(error => logger.err(error.stack));
      });
    }
  });

  client.on("rateLimit", BotEvents.rateLimit);
  client.on("warn", BotEvents.warn);
  client.on("invalidated", BotEvents.invalidated);
  client.on("guildCreate", BotEvents.guildCreate);
  client.on("error", BotEvents.error);
  client.on("webhookUpdate", BotEvents.webhookUpdate);
  client.on("guildUnavailable", BotEvents.guildUnavailable);
  client.on("invalidRequestWarning", BotEvents.invalidRequestWarning);
  client.on("shardDisconnect", BotEvents.shardDisconnect);
  client.on("shardError", BotEvents.shardError);
  client.on("shardReady", BotEvents.shardReady);
  client.on("shardReconnecting", BotEvents.shardReconnecting);
  client.on("shardResume", BotEvents.shardResume);

  if (mode == "mini") {
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

  setInterval(BotEvents.cyclePresence, 3600000);
  setInterval(BotEvents.heartBeat, 900000);
}

module.exports = doBot;

if (require.main == module) {
  doBot();
}
