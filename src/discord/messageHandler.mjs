const cfg = require("hyarcade-config").fromJSON();
import { fromJSON } from "hyarcade-config/Runtime";
import { addAccounts } from "../listUtils";
import { err, out, debug, warn, info } from "hyarcade-logger";
import isValidIGN from "../datagen/utils/ignValidator";
import { execute } from "./botCommands";
import { getWebhookObj, resolveAccount, getFromDB, writeToDB, botMode } from "./BotUtils";
import { mojangRequest, types } from "hyarcade-requests";
const { Account } = types;
import { execute as _execute } from "./MiniWallsCommands";
import SlashHelpTxt from "./Utils/SlashHelpTxt";
import { playerLink } from "./Utils/Embeds/AdvancedEmbeds";
import { ERROR_LINK_HYPIXEL_MISMATCH, ERROR_IGN_UNDEFINED, ERROR_UNKNOWN, ERROR_API_DOWN } from "./Utils/Embeds/StaticEmbeds";
import { readFile } from "fs-extra";
import { logHook, errHook } from "./Utils/Webhooks";
import { logCommand } from "./Utils/LogUtils";
import CommandResponse from "./Utils/CommandResponse";
import { Message, Collection, Webhook } from "discord.js";

const longMsgStr = "**WARNING** Attempted to send a message greater than 2000 characters in length!";

/**
 * 
 * @param {Message} msg 
 * @param {Error} e 
 */
async function logError (msg, e) {
  err(`Error from - ${msg.content}`);
  err(e.toString());
  err(e.stack);
  await logHook.send(`Error from - ${msg.content.replace(/\\?`/g, "\\`")}`);
  await errHook.send(e.toString());
}

/**
 * 
 * @param {Message} msg 
 */
async function logCmd (msg) {
  await logCommand(msg.content.split(" ")[0], msg.content.split(" ").slice(1), msg);
  out(`${msg.author.tag} ran : ${msg.cleanContent}`);
}

/**
 * @param {string} hook
 * @param {object} cmdResponse
 * @returns {boolean}
 */
async function sendAsHook (hook, cmdResponse) {
  try {
    const obj = getWebhookObj(cmdResponse.embed);
    if(cmdResponse.res != "") {
      obj.content = cmdResponse.res;
    }
    if(cmdResponse.img != undefined) {
      obj.files = [cmdResponse.img];
    }
    debug("Sending response via webhook");
    await hook.send(obj);
    return true;
  } catch (e) {
    err(e.toString());
    await errHook.send(e.toString());
    return false;
  }
}

/**
 * 
 * @param {Message} msg 
 * @returns {null}
 */
async function miniWallsVerify (msg) {
  const {
    tag
  } = msg.author;
  const {
    id
  } = msg.author;
  const ign = msg.content.trim();
  if(await isBlacklisted(id)) return;
  const uuid = await mojangRequest.getUUID(ign);
  if(uuid == undefined) {
    warn("Someone tried to verify as an account that doesn't exist!");
    await msg.channel.send({
      embeds: [ERROR_IGN_UNDEFINED]
    });
    return;
  }

  if(fromJSON().apiDown) {
    warn("Someone tried to verify while API is down!");
    return {
      res: "",
      embed: ERROR_API_DOWN
    };
  }

  const acc = new Account(ign, 0, uuid);
  await acc.updateData();
  const dbAcc = await resolveAccount(uuid, msg, false);
  const hackers = await getFromDB("hackerlist");
  const disclist = await getFromDB("disclist");
  if(dbAcc.guildID == "608066958ea8c9abb0610f4d" || hackers.includes(uuid)) {
    warn("Hacker tried to verify!");
    return;
  }
  if(acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
    await addAccounts("others", [uuid]);
    disclist[id] = uuid;
    await writeToDB("disclist", disclist);
    out(`${tag} was autoverified in miniwalls as ${ign}`);
    await msg.member.roles.remove("850033543425949736");
    await msg.member.roles.add("789721304722178069");
    await msg.member.setNickname(acc.name);
    await msg.channel.send({
      embeds: [playerLink(acc.name, msg.author)]
    });
  } else {
    await msg.channel.send({
      embeds: [ERROR_LINK_HYPIXEL_MISMATCH]
    });
  }
}

/**
 * @param {Message} msg
 * @param {object} cmdResponse
 * @param {object} opts
 */
async function attemptSend (msg, cmdResponse, opts) {
  const runtime = fromJSON();
  const hooks = await msg.channel.fetchWebhooks();
  info("Attempting to send response as webhook");
  if(!(hooks.size > 0 && sendAsHook(hooks.first(), cmdResponse))) {
    info("No webhook availiable. Sending normally");
    if(runtime.bot != "backup") {
      opts.reply = {
        messageReference: msg.id
      };
      if(cmdResponse.res != "") {
        opts.content = cmdResponse.res;
      }
      if(cmdResponse.embed != undefined) {
        opts.embeds = [cmdResponse.embed];
      }
      if(cmdResponse.img != undefined) {
        opts.files = [cmdResponse.img];
      }
      debug("Sending message via discord bot");
      try {
        await msg.channel.send(opts);
      } catch (e) {
        logError(msg, e);
        await msg.channel.send({
          embeds: [ERROR_UNKNOWN]
        });
      }
    }
  }
}

/**
 * @param {Message} msg
 */
async function addIGNs (msg) {
  if(cfg.discord.listenChannels.includes(msg.channel.id)) {
    info("IGN channel message detected, automatically adding to database.");
    const firstWord = msg.content.split(" ")[0];
    if(!msg.author.bot && isValidIGN(firstWord)) {
      const acclist = await getFromDB("acclist");
      const category = acclist[msg.content.split(" ")[1]] != undefined ? msg.content.split(" ")[1] : "others";
      out(firstWord);
      logHook.send(`Attempting to add "\`${firstWord}\`" to database.`);
      await addAccounts(category, [firstWord]);
    }
  }
}

/**
 * @param {object} cmdResponse
 * @returns {object}
 */
async function sanitizeCmdOpt (cmdResponse) {
  if(cmdResponse.res?.length > 2000) {
    cmdResponse.res = cmdResponse.res.slice(0, 2000);
    if(cmdResponse.res.slice(0, 3) == "```") {
      cmdResponse.res = `${cmdResponse.res.slice(0, 1994)}\`\`\``;
    }
    await errHook.send(longMsgStr);
    err(longMsgStr);
  }
  return cmdResponse;
}

/**
 * @param {Message} msg
 * @returns {CommandResponse | object}
 */
async function getCmdRes (msg) {
  let cmdResponse;
  try {
    cmdResponse = await execute(msg, msg.author.id);
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
    cmdResponse = await _execute(msg, msg.author.id);
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
 * @param {string} id
 * @returns {boolean}
 */
async function isBlacklisted (id) {
  let blacklist = await readFile("data/blacklist");
  blacklist = blacklist.toString().split("\n");
  return blacklist.includes(id);
}

/**
 * 
 * @param {Message} msg 
 * @param {CommandResponse} cmdResponse 
 */
async function sendText (msg, cmdResponse) {
  const runtime = fromJSON();
  if(runtime.bot != "backup") {
    info("No webhook availiable. Sending normally");
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
  info("Attempting to send response as webhook");

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
 * @param {Message} msg
 */
async function mwMode (msg) {
  const cmdResponse = await getMWCmdRes(msg);
  const isValidResponse =
        cmdResponse != undefined &&
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined);
  if(isValidResponse) {
    if(await isBlacklisted(msg.author.id)) {
      return;
    }
    const opts = {};
    if(cmdResponse.embed) {
      opts.embed = cmdResponse.embed;
    }

    await sanitizeCmdOpt(cmdResponse);

    await attemptSend(msg, cmdResponse, opts);
    await logCmd(msg);
  }
}

/**
 * @param {object} cmdResponse
 * @returns {boolean}
 */
function checkResponse (cmdResponse) {
  return cmdResponse != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined || cmdResponse.silent == true);
}

/**
 * 
 * @param {Message} msg 
 * @param {object | CommandResponse} cmdResponse 
 * @param {boolean} isDiscordResponse
 */
async function handleCommand (msg, cmdResponse, isDiscordResponse) {
  if(await isBlacklisted(msg.author.id)) {
    return;
  }

  if(isDiscordResponse) {
    if(!cmdResponse.silent) {
      await sendNormal(msg, cmdResponse);
    }
  } else {
    const opts = {};
    if(cmdResponse.embed) {
      opts.embed = cmdResponse.embed;
    }
    await sanitizeCmdOpt(cmdResponse);
    if(!cmdResponse.silent) {
      await attemptSend(msg, cmdResponse, opts);
    }
  }
  await logCmd(msg);
}

/**
 * @param {Message} msg
 */
async function checkMW (msg) {
  if(msg.channel.id == "791122377333407784") await miniWallsVerify(msg);
  if(msg.guild.id == "789718245015289886" || msg.guild.id == "677552571568619531") {
    await mwMode(msg);
    return;
  }
  return;

}

/**
 * 
 * @param {Message} msg 
 */
export default async function messageHandler (msg) {
  if(msg.author.bot) return;
  if(msg.webhookID) return;
  if(msg.guild.id == "808077828842455090") {
    warn("Ignored guild message detected!");
    return;
  }

  if(botMode == "mw" || botMode == "test") {
    await checkMW(msg);
    if(botMode == "mw") {
      return;
    }
  }

  let cmdResponse = await getCmdRes(msg);
  let isValidResponse = false;
  let isDiscordResponse = false;

  if(cmdResponse instanceof CommandResponse && cmdResponse.isValid()) {
    isValidResponse = true;
    isDiscordResponse = true;
  } else {
    isValidResponse = checkResponse(cmdResponse);
    if(!isValidResponse) {
      cmdResponse = SlashHelpTxt(msg);
      isValidResponse = checkResponse(cmdResponse);
    }
  }

  if(isValidResponse) {
    await handleCommand(msg, cmdResponse, isDiscordResponse);
  }

  await addIGNs(msg);
}
