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
const { default: NameUpdater } = require("./NameUpdater.mjs");

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
      await BotRuntime.client.destroy();
    } else if(mode == "slash") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      logger.out(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
      logHook.send(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
    } else if(mode == "mini") {
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
      await NameUpdater(BotRuntime.client);
    }
  }

  static warn (info) {
    logger.warn("Discord sent a warning:");
    logger.warn(info);
  }

  static invalidated () {
    logger.error("Discord session invalidated!");
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
    logger.err("Discord encountered an error");
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
    logger.warn(`Guild ${guild.name} has become unavailable!`);
  }

  /**
   * 
   * @param {InvalidRequestWarningData} warning 
   */
  static invalidRequestWarning (warning) {
    logger.warn(`An invalid request was made, this is number ${warning.count}!`);
  }

  static debug (info) {
    logger.debug(info);
  }

  static async cyclePresence () {
    logger.info("Cycling presence...");
    await SetPresence(BotRuntime.client, BotRuntime.botMode);
  }
};
