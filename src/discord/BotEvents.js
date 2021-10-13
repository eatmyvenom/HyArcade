const cfg = require("hyarcade-config").fromJSON();
const {
  Guild,
  TextChannel,
  InvalidRequestWarningData
} = require("discord.js");
const Runtime = require("hyarcade-config/Runtime");
const logger = require("hyarcade-logger");
const BotRuntime = require("./BotRuntime");
const roleHandler = require("./roleHandler");
const fs = require("fs-extra");
const Webhooks = require("./Utils/Webhooks");
const SetPresence = require("./Utils/SetPresence");

module.exports = class BotEvents {

  static async rateLimit (rlInfo) {
    const {
      timeout
    } = rlInfo;
    const str = `Bot rate limited\nTime : ${timeout}\nCause : ${rlInfo.method.toUpperCase()} - ${rlInfo.path}\n`;
    logger.err(str);
    try {
      await Webhooks.errHook.send(str);
    } catch (e) {
      logger.err("Can't log to error hook");
    }
  }

  static async messageDelete (msg) {
    if(BotRuntime.botMode == "mw") {
      if(msg.content.charAt(0) == ".") {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    } else {
      if(msg.content.charAt(0) == cfg.commandCharacter) {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    }
  }

  static async ready (mode) {
    BotRuntime.isBotInstance = true;
    BotRuntime.botMode = mode;

    logger.info("Fetching logging channels");
    const errchannel = await BotRuntime.client.channels.fetch(cfg.discord.errChannel);
    const logchannel = await BotRuntime.client.channels.fetch(cfg.discord.logChannel);

    logger.info("Fetching logging hooks");
    const errhooks = await errchannel.fetchWebhooks();
    const loghooks = await logchannel.fetchWebhooks();
    const errHook = await errhooks.first();
    const logHook = await loghooks.first();
    Webhooks.errHook = errHook;
    Webhooks.logHook = logHook;
    logger.info("Creating message copy hook");
    Webhooks.commandHook = await (await (await BotRuntime.client.channels.fetch(cfg.discord.cmdChannel)).fetchWebhooks()).first();

    logger.info("Reading trusted users");
    const trustedFile = await fs.readFile("data/trustedUsers");
    const tus = trustedFile.toString().trim()
      .split("\n");
    BotRuntime.tus = tus;

    logger.info("Selecting mode");
    if(mode == "role") {
      await roleHandler(BotRuntime.client);
      BotRuntime.client.destroy();

      // eslint-disable-next-line no-undef
      process.exit(0);
    } else if(BotRuntime.botMode == "slash") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
    } else if(BotRuntime.botMode == "mini") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - Micro module`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag} - Micro module`);
    } else if(BotRuntime.botMode == "mw") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - MW module`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag} - MW module`);
    } else if(BotRuntime.botMode == "test") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag}!`);
    } else {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);

      logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag}!`);
    }
    await SetPresence(BotRuntime.client, mode);
  }

  static async heartBeat () {
    const runtime = Runtime.fromJSON();
    runtime[`${BotRuntime.botMode}HeartBeat`] = Date.now();
    await runtime.save();
    logger.info("Heart beat - I'm alive!");

    if(runtime.needRoleupdate == true && BotRuntime.botMode == undefined) {
      await roleHandler(BotRuntime.client);
      logger.out("Roles updated!");
      runtime.needRoleupdate = false;
      await runtime.save();
    }

    if(BotRuntime.botMode == "mw") {
      const NameUpdater = await import("./NameUpdater.mjs");
      await NameUpdater.default(BotRuntime.client);
    }
  }

  static warn (info) {
    logger.warn(info);
  }

  static invalidated () {
    logger.error("Discord session invalidated! Bot will most likely stop soon.");
  }

  /**
   * 
   * @param {Guild} guild 
   */
  static guildCreate (guild) {
    logger.out(`Bot was added to guild ${guild.name} with ${guild.memberCount} members!`);
    logger.debug(`Guild owner: ${guild.ownerID}`);
    logger.debug(`Guild ID: ${guild.id}`);
  }

  /**
   * 
   * @param {Error} error 
   */
  static error (error) {
    logger.err(`${error.name} : ${error.message}`);
    logger.err(`Current stack:\n${error.stack}`);
  }

  /**
   * 
   * @param {TextChannel} channel 
   */
  static webhookUpdate (channel) {
    logger.debug(`${channel.guild.name}#${channel.name} had a webhook change`);
  }

  /**
   * 
   * @param {Guild} guild 
   */
  static guildUnavailable (guild) {
    logger.warn(`Guild ${guild.name} has become unavailable! Bot will no longer respond there.`);
  }

  /**
   * 
   * @param {InvalidRequestWarningData} warning 
   */
  static invalidRequestWarning (warning) {
    logger.warn(`An invalid request was made, this is number ${warning.count}!`);
  }

  static async cyclePresence () {
    logger.info("Cycling presence...");
    await SetPresence(BotRuntime.client, BotRuntime.botMode);
  }

  static guildIntegrationsUpdate (guild) {
    logger.debug(`${guild.name}'s integrations updated`);
  }

  static shardDisconnect (event, id) {
    logger.warn(`Shard ${id} has disconnected and will no longer reconnect!`);
    logger.warn(`Code : ${event.code} - ${event.reason}`);
  }

  static shardError (error, shardId) {
    logger.error(`Shard ${shardId} has encountered an error!`);
    logger.error(error.stack);
  }

  static shardReady (id) {
    logger.info(`Shard ${id} is ready!`);
  }

  static shardReconnecting (id) {
    logger.out(`Shard ${id} is reconnecting, bot is unable to respond during this time`);
  }

  static shardResume (id, replayedEvents) {
    logger.out(`Shard ${id} has resumed succesfully with ${replayedEvents} replayed events.`);
  }
};
