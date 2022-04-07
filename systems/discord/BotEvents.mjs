import Logger from "@hyarcade/logger";
import BotRuntime from "./BotRuntime.js";
import { ERROR_LOG } from "./Utils/Embeds/DynamicEmbeds.js";
import SetPresence from "./Utils/SetPresence.js";
import Webhooks from "./Utils/Webhooks.js";
import roleHandler from "./Utils/MemberHandlers/roleHandler.js";
import NameUpdater from "./Utils/MemberHandlers/NameUpdater.mjs";
import { createRequire } from "node:module";
import Config from "@hyarcade/config";

const require = createRequire(import.meta.url);
const { Guild, TextChannel, InvalidRequestWarningData, Webhook } = require("discord.js");
const cfg = Config.fromJSON();

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
    Logger.err(str);
    try {
      await Webhooks.errHook.send(str);
    } catch {
      Logger.err("Can't log previous message to error hook");
    }
  }

  async messageDelete(msg) {
    if (BotRuntime.botMode == "mw") {
      if (msg.content.charAt(0) == ".") {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        Logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    } else {
      if (msg.content.charAt(0) == cfg.commandCharacter) {
        const str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
        Logger.warn(str);
        await Webhooks.logHook.send(str);
      }
    }
  }

  async ready(mode) {
    BotRuntime.isBotInstance = true;
    BotRuntime.botMode = mode;

    Logger.info("Fetching logging hooks");
    Webhooks.errHook = await getHookFromChannel(cfg.discord.errChannel);
    Webhooks.logHook = await getHookFromChannel(cfg.discord.logChannel);

    Logger.info("Fetching command log hook");
    Webhooks.commandHook = await getHookFromChannel(cfg.discord.cmdChannel);

    Logger.info("Fetching verify log hook");
    Webhooks.verifyHook = await getHookFromChannel(cfg.discord.verifyChannel);

    Logger.info("Reading trusted users");
    BotRuntime.tus = cfg.discord.trustedUsers;

    Logger.info("Selecting mode");
    if (mode == "role") {
      await roleHandler(BotRuntime.client);
      BotRuntime.client.destroy();

      // eslint-disable-next-line no-undef
      process.exit(0);
    } else if (BotRuntime.botMode == "slash") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      Logger.name = "Interactions";
      Logger.out(`Logged in as ${BotRuntime.client.user.tag} - Interaction module`);
    } else if (BotRuntime.botMode == "mini") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      Logger.out(`Logged in as ${BotRuntime.client.user.tag} - Micro module`);
      await InteractionHandler.default(BotRuntime.client);
    } else if (BotRuntime.botMode == "mw") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      Logger.name = "MIWBot";
      Logger.emoji = "⚔️";
      Logger.out(`Logged in as ${BotRuntime.client.user.tag} - MW module`);
    } else if (BotRuntime.botMode == "test") {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);
      Logger.name = "TestBot";
      Logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
    } else {
      const InteractionHandler = await import("./InteractionHandler.mjs");
      await InteractionHandler.default(BotRuntime.client);

      Logger.name = "ArcadeBot";
      Logger.out(`Logged in as ${BotRuntime.client.user.tag}!`);
    }
    await SetPresence(BotRuntime.client, mode);
  }

  async heartBeat() {
    Logger.info("Heart beat - I'm alive!");

    if (BotRuntime.botMode == undefined) {
      await roleHandler(BotRuntime.client);
      Logger.out("Roles updated!");
    }

    if (BotRuntime.botMode == "mw") {
      await NameUpdater(BotRuntime.client);
    }
  }

  warn(info) {
    Logger.warn(info);
  }

  invalidated() {
    Logger.error("Discord session invalidated! Bot will most likely stop soon.");
  }

  /**
   *
   * @param {Guild} guild
   */
  guildCreate(guild) {
    Webhooks.logHook.send(
      `Bot was added to guild ${guild.name} with ${guild.memberCount} members!\nGuild owner: ${guild.ownerID}\nGuild ID: ${guild.id}`,
    );
    Logger.out(`Bot was added to guild ${guild.name} with ${guild.memberCount} members!`);
    Logger.debug(`Guild owner: ${guild.ownerID}`);
    Logger.debug(`Guild ID: ${guild.id}`);
  }

  /**
   *
   * @param {Error} error
   */
  error(error) {
    Logger.err(`${error.name} : ${error.message}`);
    Logger.err(`Current stack:\n${error.stack}`);
    Webhooks.errHook.send(ERROR_LOG(error, "unknown"));
  }

  /**
   *
   * @param {TextChannel} channel
   */
  webhookUpdate(channel) {
    Logger.debug(`${channel.guild.name}#${channel.name} had a webhook change`);
  }

  /**
   *
   * @param {Guild} guild
   */
  guildUnavailable(guild) {
    const logStr = `Guild ${guild.name} has become unavailable! Bot will no longer respond there.`;
    Logger.warn(logStr);
    Webhooks.logHook.send({ content: logStr });
  }

  /**
   *
   * @param {InvalidRequestWarningData} warning
   */
  invalidRequestWarning(warning) {
    Logger.warn(`An invalid request was made, this is number ${warning.count}!`);
  }

  async cyclePresence() {
    Logger.info("Cycling presence...");
    await SetPresence(BotRuntime.client, BotRuntime.botMode);
  }

  guildIntegrationsUpdate(guild) {
    Logger.debug(`${guild.name}'s integrations updated`);
  }

  shardDisconnect(event, id) {
    Logger.warn(`Shard ${id} has disconnected and will no longer reconnect!`);
    Logger.warn(`Code : ${event.code} - ${event.reason}`);
  }

  shardError(error, shardId) {
    Logger.error(`Shard ${shardId} has encountered an error!`);
    Logger.error(error.stack);
    Webhooks.errHook.send(ERROR_LOG(error, `Shard ${shardId} has encountered an error!`));
  }

  shardReady(id) {
    Logger.info(`Shard ${id} is ready!`);
  }

  shardReconnecting(id) {
    Logger.out(`Shard ${id} is reconnecting, bot is unable to respond during this time`);
  }

  shardResume(id, replayedEvents) {
    Logger.out(`Shard ${id} has resumed succesfully with ${replayedEvents} replayed events.`);
  }
}

export default new BotEventsManager();
