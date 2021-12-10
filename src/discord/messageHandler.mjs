import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cfg = require("hyarcade-config").fromJSON();
import Runtime from "hyarcade-config/Runtime.js";
import { addAccounts } from "../listUtils.js";
import Logger from "hyarcade-logger";
import isValidIGN from "../datagen/utils/ignValidator.js";
import botCommands from "./botCommands.mjs";
import BotRuntime from "./BotRuntime.js";
import mwCommands from "./MiniWallsCommands.js";
import Webhooks from "./Utils/Webhooks.js";
import LogUtils from "./Utils/LogUtils.js";
import CommandResponse from "./Utils/CommandResponse.js";
import SlashHelpTxt from "./Utils/SlashHelpTxt.js";
import MiniWallsVerify from "./MiniWallsVerify.mjs";
import VerifyChannel from "./VerifyChannel.js";
const { ERROR_UNKNOWN } = require("./Utils/Embeds/StaticEmbeds.js");
const { Message, Collection, Webhook } = require("discord.js");

/**
 * 
 * @param {Message} msg 
 * @param {Error} e 
 */
async function logError (msg, e) {
  Logger.err(`Error from - ${msg.content}`);
  Logger.err(e.toString());
  Logger.err(e.stack);
  await Webhooks.logHook.send(`Error from - ${msg.content.replace(/\\?`/g, "\\`")}`);
  await Webhooks.errHook.send(e.toString());
}

/**
 * 
 * @param {Message} msg 
 */
async function logCmd (msg) {
  LogUtils.logCommand(msg.content.split(" ")[0], msg.content.split(" ").slice(1), msg)
    .then(() => {})
    .catch(Logger.err);
  Logger.out(`${msg.author.tag} ran : ${msg.cleanContent}`);
}

/**
 * @param {Message} msg
 */
async function addIGNs (msg) {
  if(cfg.discord.listenChannels.includes(msg.channel.id)) {
    Logger.info("IGN channel message detected, automatically adding to database.");
    const firstWord = msg.content.split(" ")[0];
    if(!msg.author.bot && isValidIGN(firstWord)) {
      Logger.out(`Attempting to add "${firstWord}" to database.`);
      await addAccounts([firstWord]);
    }
  }
}

/**
 * @param {Message} msg
 * @returns {CommandResponse | object}
 */
async function getCmdRes (msg) {
  let cmdResponse;
  try {
    cmdResponse = await botCommands.execute(msg, msg.author.id);
  } catch (e) {
    await logError(msg, e);
    cmdResponse = ({
      res: "",
      embed: [ERROR_UNKNOWN]
    });
  }

  return cmdResponse;
}

/**
 * 
 * @param {Message} msg 
 * @returns {object}
 */
async function getMWCmdRes (msg) {
  let cmdResponse;
  try {
    cmdResponse = await mwCommands.execute(msg, msg.author.id);
  } catch (e) {
    await logError(msg, e);
    cmdResponse = new CommandResponse("", ERROR_UNKNOWN);
  }

  return cmdResponse;
}

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted (id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 * 
 * @param {Message} msg 
 * @param {CommandResponse} cmdResponse 
 */
async function sendText (msg, cmdResponse) {
  const runtime = Runtime.fromJSON();
  if(runtime.bot != "backup") {
    Logger.info("No webhook availiable. Sending normally");
    try {
      const msgObj = cmdResponse.toDiscord({
        messageReference: msg.id
      });
      await msg.channel.send(msgObj);
    } catch (e) {
      logError(msg, e);
      await msg.channel.send({
        embeds: [ERROR_UNKNOWN]
      });
    }
  }
}

/**
 * 
 * @param {Message} msg 
 * @param {CommandResponse} cmdResponse 
 */
async function sendNormal (msg, cmdResponse) {
  /**
   * @type {Collection<string, Webhook>}
   */
  let hooks;
  try {
    hooks = await msg.channel.fetchWebhooks();
  } catch (e) {
    await sendText(msg, cmdResponse);
  }
  Logger.info("Attempting to send response as webhook");

  if(hooks.size > 0) {
    const hook = hooks.first();
    try {
      await hook.send(cmdResponse.toDiscord(undefined, true));
    } catch (e) {
      await sendText(msg, cmdResponse);
    }
  } else {
    await sendText(msg, cmdResponse);
  }
}

/**
 * 
 * @param {object} res 
 * @returns {CommandResponse}
 */
function transformResponse (res) {
  if(res instanceof CommandResponse) {
    return res;
  }

  return new CommandResponse(res);
}

/**
 * 
 * @param {Message} msg 
 * @param {object | CommandResponse} cmdResponse
 */
async function handleCommand (msg, cmdResponse) {
  if(await isBlacklisted(msg.author.id)) {
    return;
  }

  if(!cmdResponse.silent) {
    await sendNormal(msg, cmdResponse);
  }

  await logCmd(msg);
}

/**
 * @param {Message} msg
 */
async function checkMW (msg) {
  if(msg.channel.id == "791122377333407784") await MiniWallsVerify(msg);
  if(cfg.discord.miniWalls.guilds.includes(msg.guild.id) || cfg.discord.miniWalls.channels.includes(msg.channel.id)) {
    await mwMode(msg);
    return;
  }
  return;

}

/**
 * @param {Message} msg
 */
async function mwMode (msg) {
  const cmdResponse = transformResponse(await getMWCmdRes(msg));
  const isValidResponse = cmdResponse.isValid();

  if(isValidResponse) {
    await handleCommand(msg, cmdResponse);
  }
}

/**
 * 
 * @param {Message} msg 
 * @returns {*}
 */
export default async function messageHandler (msg) {
  if(msg.author.bot) return;
  if(msg.webhookID != undefined) return;

  if(msg.channel.id == "918710048493039676") return await VerifyChannel(msg, "841092980931952660", "918716775011590194");

  if(BotRuntime.botMode == "mw" || BotRuntime.botMode == "test") {
    await checkMW(msg);
    if(BotRuntime.botMode == "mw") {
      return;
    }
  }

  let cmdResponse = transformResponse(await getCmdRes(msg));
  let isValidResponse = cmdResponse.isValid();

  if(!isValidResponse) {
    cmdResponse = transformResponse(SlashHelpTxt(msg));
    isValidResponse = cmdResponse.isValid();
  }

  if(isValidResponse) {
    await handleCommand(msg, cmdResponse);
    return;
  }

  await addIGNs(msg);
}
