const { Guild, TextChannel, InvalidRequestWarningData, Webhook } = require("discord.js");
const cfg = require("@hyarcade/config").fromJSON();
const logger = require("@hyarcade/logger");
const BotRuntime = require("./BotRuntime");
const { ERROR_LOG } = require("./Utils/Embeds/DynamicEmbeds");
const SetPresence = require("./Utils/SetPresence");
const Webhooks = require("./Utils/Webhooks");
const roleHandler = require("./Utils/MemberHandlers/roleHandler");

/**
 * @param {string} channelID
 * @returns {Webhook}
 */
async function getHookFromChannel(channelID) {
  const channelData = await BotRuntime.client.channels.fetch(channelID);
  const channelHooks = await channelData.fetchWebhooks();
  return await channelHooks.first();
}

class BotEventsManager {
  async rateLimit(rlInfo) {
    const { timeout, method, path } = rlInfo;
    const str = `Rate limit event triggered\nTime : ${timeout}\nCause : ${method.toUpperCase()} - ${path}\n`;
    logger.err(str);
    try {
      await Webhooks.errHook.send(str);
    } catch {
      logger.err("Can't log previous message to error hook");
    }
  }

  async messageDelete(msg) {
    if (BotRuntime.botMode == "mw") {
      if (msg.content.charAt(0) == ".") {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    } else {
      if (msg.content.charAt(0) == cfg.commandCharacter) {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    }
  }

  async ready(mode) {
    BotRuntime.isBotInstance = true;
    BotRuntime.botMode = mode;

    logger.info("Fetching logging hooks");
    Webhooks.errHook = await getHookFromChannel(cfg.discord.errChannel);
    Webhooks.logHook = await getHookFromChannel(cfg.discord.logChannel);

    logger.info("Fetching command log hook");
    Webhooks.commandHook = await getHookFromChannel(cfg.discord.cmdChannel);

    logger.info("Fetching verify log hook");
    Webhooks.verifyHook = await getHookFromChannel(cfg.discord.verifyChannel);

    logger.info("Reading trusted users");
    BotRuntime.tus = cfg.discord.trustedUsers;

    logger.info("Selecting mode");
    if (mode == "role") {
      await roleHandler(BotRuntime.client);
      BotRuntime.client.destroy();

      // eslint-disable-next-line no-undef
      process.exit(0);
    } else if (BotRuntime.botMode == "slash") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.name = "Interactions";
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
    } else if (BotRuntime.botMode == "mini") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - Micro module`);
      await InteractionHandler.default(BotRuntime.client);
    } else if (BotRuntime.botMode == "mw") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.name = "Mini-Walls-Bot";
      logger.emoji = "⚔️";
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - MW module`);
    } else if (BotRuntime.botMode == "test") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.name = "Test-Bot";
      logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
    } else {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);

      logger.name = "Arcade-Bot";
      logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
    }
    await SetPresence(BotRuntime.client, mode);
  }

  async heartBeat() {
    logger.info("Heart beat - I'm alive!");

    if (BotRuntime.botMode == undefined) {
      await roleHandler(BotRuntime.client);
      logger.out("Roles updated!");
    }

    if (BotRuntime.botMode == "mw") {
      const NameUpdater = await import("./Utils/MemberHandlers/NameUpdater.mjs");
      await NameUpdater.default(BotRuntime.client);
    }
  }

  warn(info) {
    logger.warn(info);
  }

  invalidated() {
    logger.error("Discord session invalidated! Bot will most likely stop soon.");
  }

  /**
   *
   * @param {Guild} guild
   */
  guildCreate(guild) {
    Webhooks.logHook.send(
      `Bot was added to guild ${guild.name} with ${guild.memberCount} members!\nGuild owner: ${guild.ownerID}\nGuild ID: ${guild.id}`,
    );
    logger.out(`Bot was added to guild ${guild.name} with ${guild.memberCount} members!`);
    logger.debug(`Guild owner: ${guild.ownerID}`);
    logger.debug(`Guild ID: ${guild.id}`);
  }

  /**
   *
   * @param {Error} error
   */
  error(error) {
    logger.err(`${error.name} : ${error.message}`);
    logger.err(`Current stack:\n${error.stack}`);
    Webhooks.errHook.send(ERROR_LOG(error, "unknown"));
  }

  /**
   *
   * @param {TextChannel} channel
   */
  webhookUpdate(channel) {
    logger.debug(`${channel.guild.name}#${channel.name} had a webhook change`);
  }

  /**
   *
   * @param {Guild} guild
   */
  guildUnavailable(guild) {
    const logStr = `Guild ${guild.name} has become unavailable! Bot will no longer respond there.`;
    logger.warn(logStr);
    Webhooks.logHook.send({ content: logStr });
  }

  /**
   *
   * @param {InvalidRequestWarningData} warning
   */
  invalidRequestWarning(warning) {
    logger.warn(`An invalid request was made, this is number ${warning.count}!`);
  }

  async cyclePresence() {
    logger.info("Cycling presence...");
    await SetPresence(BotRuntime.client, BotRuntime.botMode);
  }

  guildIntegrationsUpdate(guild) {
    logger.debug(`${guild.name}'s integrations updated`);
  }

  shardDisconnect(event, id) {
    logger.warn(`Shard ${id} has disconnected and will no longer reconnect!`);
    logger.warn(`Code : ${event.code} - ${event.reason}`);
  }

  shardError(error, shardId) {
    logger.error(`Shard ${shardId} has encountered an error!`);
    logger.error(error.stack);
    Webhooks.errHook.send(ERROR_LOG(error, `Shard ${shardId} has encountered an error!`));
  }

  shardReady(id) {
    logger.info(`Shard ${id} is ready!`);
  }

  shardReconnecting(id) {
    logger.out(`Shard ${id} is reconnecting, bot is unable to respond during this time`);
  }

  shardResume(id, replayedEvents) {
    logger.out(`Shard ${id} has resumed succesfully with ${replayedEvents} replayed events.`);
  }
}

module.exports = new BotEventsManager();
