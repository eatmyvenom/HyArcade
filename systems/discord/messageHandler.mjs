import Logger from "@hyarcade/logger";
import { createRequire } from "node:module";
import botCommands from "./botCommands.mjs";
import BotRuntime from "./BotRuntime.js";
import mwCommands from "./MiniWallsCommands.js";
import CommandResponse from "./Utils/CommandResponse.js";
import { ERROR_LOG } from "./Utils/Embeds/DynamicEmbeds.js";
import LogUtils from "./Utils/LogUtils.js";
import MiniWallsVerify from "./Utils/MiniWallsVerify.mjs";
import SlashHelpTxt from "./Utils/SlashHelpTxt.js";
import VerifyChannel from "./Utils/VerifyChannel.js";
import Webhooks from "./Utils/Webhooks.js";

const require = createRequire(import.meta.url);
const { Message } = require("discord.js");
const cfg = require("@hyarcade/config").fromJSON();
const { ERROR_UNKNOWN } = require("./Utils/Embeds/StaticEmbeds.js");

/**
 *
 * @param {Message} msg
 * @param {Error} e
 */
async function logError(msg, e) {
  Logger.err(`Error from - ${msg.content}`);
  Logger.err(e.toString());
  Logger.err(e.stack);
  await Webhooks.errHook.send({ embeds: [ERROR_LOG(e, `Error from /${msg.content}`)] });
}

/**
 *
 * @param {Message} msg
 */
async function logCmd(msg) {
  LogUtils.logCommand(msg.content.split(" ")[0], msg.content.split(" ").slice(1), msg)
    .then(() => {})
    .catch(error => Logger.err(error.stack));
  Logger.out(`${msg.author.tag} ran : ${msg.cleanContent}`);
}

/**
 * @param {Message} msg
 * @returns {CommandResponse | object}
 */
async function getCmdRes(msg) {
  let cmdResponse;
  try {
    cmdResponse = await botCommands.execute(msg, msg.author.id);
  } catch (error) {
    await logError(msg, error);
    cmdResponse = {
      res: "",
      embed: [ERROR_UNKNOWN],
    };
  }

  return cmdResponse;
}

/**
 *
 * @param {Message} msg
 * @returns {object}
 */
async function getMWCmdRes(msg) {
  let cmdResponse;
  try {
    cmdResponse = await mwCommands.execute(msg, msg.author.id);
  } catch (error) {
    await logError(msg, error);
    cmdResponse = new CommandResponse("", ERROR_UNKNOWN);
  }

  return cmdResponse;
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted(id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 *
 * @param {Message} msg
 * @param {CommandResponse} cmdResponse
 */
async function sendText(msg, cmdResponse) {
  Logger.info("Sending command response!");
  try {
    const msgObj = cmdResponse.toDiscord({
      messageReference: msg.id,
    });
    await msg.channel.send(msgObj);
  } catch (error) {
    logError(msg, error);
    await msg.channel.send({
      embeds: [ERROR_UNKNOWN],
    });
  }
}

/**
 *
 * @param {Message} msg
 * @param {CommandResponse} cmdResponse
 */
async function sendNormal(msg, cmdResponse) {
  await sendText(msg, cmdResponse);
}

/**
 *
 * @param {object} res
 * @returns {CommandResponse}
 */
function transformResponse(res) {
  if (res instanceof CommandResponse) {
    return res;
  }

  return new CommandResponse(res);
}

/**
 *
 * @param {Message} msg
 * @param {object | CommandResponse} cmdResponse
 */
async function handleCommand(msg, cmdResponse) {
  if (await isBlacklisted(msg.author.id)) {
    Logger.warn(`Blacklisted user ${msg.author.tag} tried to run a command`);
    return;
  }

  if (!cmdResponse.silent) {
    await sendNormal(msg, cmdResponse);
  }

  await logCmd(msg);
}

/**
 * @param {Message} msg
 */
async function mwMode(msg) {
  const cmdResponse = transformResponse(await getMWCmdRes(msg));
  const isValidResponse = cmdResponse.isValid();

  if (isValidResponse) {
    await handleCommand(msg, cmdResponse);
  }
}

/**
 * @param {Message} msg
 */
async function checkMW(msg) {
  if (msg.channel.id == "791122377333407784") await MiniWallsVerify(msg);
  if (cfg.discord.miniWalls.guilds.includes(msg.guild.id) || cfg.discord.miniWalls.channels.includes(msg.channel.id)) {
    await mwMode(msg);
    return;
  }
  return;
}

/**
 *
 * @param {Message} msg
 * @returns {*}
 */
export default async function messageHandler(msg) {
  if (msg.author.bot) return;
  if (msg.webhookID != undefined) return;

  for (const verifyChannel of cfg.discordBot.verifyChannels) {
    if (msg.channel.id === verifyChannel.channel) {
      await VerifyChannel(msg, verifyChannel.add, verifyChannel.remove);
      return;
    }
  }

  if (BotRuntime.botMode == "mw" || BotRuntime.botMode == "test") {
    await checkMW(msg);
    if (BotRuntime.botMode == "mw") {
      return;
    }
  }

  let cmdResponse = transformResponse(await getCmdRes(msg));
  let isValidResponse = cmdResponse.isValid();

  if (!isValidResponse) {
    cmdResponse = transformResponse(SlashHelpTxt(msg));
    isValidResponse = cmdResponse.isValid();
  }

  if (isValidResponse) {
    await handleCommand(msg, cmdResponse);
    return;
  }
}
