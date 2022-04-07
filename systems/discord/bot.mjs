import process from "node:process";
import Config from "@hyarcade/config";
import Logger from "@hyarcade/logger";
import BotEvents from "./BotEvents.mjs";
import BotRuntime from "./BotRuntime.js";
import { Intents, Client } from "discord.js";

const config = Config.fromJSON();

const fullIntents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_WEBHOOKS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_MEMBERS,
];

const lesserIntents = [Intents.FLAGS.GUILDS];

const miwIntents = [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS];

/**
 * Execute the discord bot
 *
 */
function doBot() {
  Logger.name = "Bot";
  const mode = process.argv[3];
  let client;
  if (mode == "mini") {
    client = new Client({
      intents: lesserIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else if (mode == "mw") {
    client = new Client({
      intents: miwIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else if (mode == "slash") {
    client = new Client({
      intents: lesserIntents,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
    });
  } else {
    client = new Client({
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

      Logger.debug("Registering message event");
      const messageHandler = await import("./messageHandler.mjs");
      client.on("messageCreate", msg => {
        messageHandler.default(msg).catch(error => Logger.err(error.stack));
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
    Logger.info("Logging in to micro arcade module");
    client.login(config.discord.miniToken);
  } else if (mode == "mw") {
    Logger.info("Logging in to mini walls module");
    client.login(config.discord.mwToken);
  } else if (mode == "test") {
    Logger.info("Logging in to testing bot");
    client.login(config.discord.testToken);
  } else {
    Logger.info("Logging in to arcade bot");
    client.login(config.discord.token);
  }

  setInterval(BotEvents.cyclePresence, 3600000);
  setInterval(BotEvents.heartBeat, 900000);
}

export default doBot;

if (process.argv[1].endsWith("bot.mjs")) {
  doBot();
}
