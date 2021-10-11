import { createRequire } from "module";
const require = createRequire(import.meta.url);
import config from "hyarcade-config";
const cfg = config.fromJSON();
import Logger from "hyarcade-logger";
import Runtime from "hyarcade-config/Runtime.js";

const owner = 156952208045375488;

import Link from "./Commands/Link.js";
import { Verify } from "./Commands/LinkMe.mjs";
import LastUpdate from "./Commands/LastUpdate.js";
import KillBot from "./Commands/KillBot.mjs";
import MkInv from "./Commands/MakeInviteEmbed.js";
import MKHook from "./Commands/MakeHook.js";
import UpdateRoles from "./Commands/UpdateRoles.js";
import Info from "./Commands/Info.mjs";
import EZ from "./Commands/EZ.mjs";
import Ping from "./Commands/Ping.mjs";
import Echo from "./Commands/Echo.mjs";
import Blacklist from "./Commands/Blacklist.mjs";
import ApiRaw from "./Commands/ApiRaw.mjs";
import CyclePresence from "./Commands/CyclePresence.mjs";
import Eval from "./Commands/Eval.mjs";
import Ezmsgs from "./Commands/ezmsgs.mjs";
import Hackerlist from "./Commands/Hackerlist.mjs";
import SetAvatar from "./Commands/SetAvatar.js";
import SetPresence from "./Commands/SetPresence.js";
import SetUsername from "./Commands/SetUsername.js";
import Exec from "./Commands/Exec.js";
import GetDataRaw from "./Commands/GetDataRaw.js";
import FetchUser from "./Commands/FetchUser.js";
import FetchGuild from "./Commands/FetchGuild.js";
import FetchChannel from "./Commands/FetchChannel.js";
import TopGames from "./Commands/TopGames.mjs";
import { WhoIS } from "./Commands/WhoIS.mjs";
import { Profile } from "./Commands/Profile.mjs";
import DBInfo from "./Commands/DBInfo.js";
import Help from "./Commands/Help.js";

import CommandResponse from "./Utils/CommandResponse.js";
import MiniWalls from "./Commands/MiniWalls.js";
import MiniWallsLB from "./Commands/MiniWallsLB.js";

const { ERROR_DATABASE_ERROR, ERROR_USE_SLASH_COMMAND } = require("./Utils/Embeds/DynamicEmbeds");
const { ERROR_API_DOWN } = require("./Utils/Embeds/StaticEmbeds");
const { Message } = require("discord.js");

/**
 * @param {Message} msg
 * @param {string} senderID
 * @returns {CommandResponse | object}
 */
async function execute (msg, senderID) {
  if(msg.content.startsWith(cfg.commandCharacter)) {
    const rt = Runtime.fromJSON();
    if(rt.dbERROR) {
      return {
        res: "",
        embed: ERROR_DATABASE_ERROR
      };
    }
    if(rt.apiDown) {
      return {
        res: "",
        embed: ERROR_API_DOWN
      };
    }
    const cmdArr = msg.content.slice(cfg.commandCharacter.length).split(/\s/g);
    const res = await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    if(res instanceof CommandResponse) {
      return res;
    }
    return new CommandResponse(res);

  }
  return;
}

/**
 * @param {Message} rawMsg
 * @param {string} command
 * @param {string[]} args
 * @param {string} author
 * @returns {CommandResponse | object}
 */
async function checkCommands (rawMsg, command, args, author) {
  Logger.debug(`Parsing command ${rawMsg.content}`);
  switch(command.toLowerCase()) {
  case "link":
  case "ln":
    return await Link.execute(args, author, rawMsg);

  case "lnm":
  case "verify":
  case "linkme": {
    return await Verify.execute(args, author, rawMsg);
  }

  case "stats":
  case "s":
    return {
      res: "", embed: ERROR_USE_SLASH_COMMAND("s", "stats")
    };

  case "lb":
  case "lead":
  case "leaderboard":
  case "leadb": {
    return {
      res: "",
      embed: ERROR_USE_SLASH_COMMAND("lb", "leaderboard")
    };
  }

  case "quit":
  case "stopbot":
  case "killbot":
  case "botstop": {
    return await KillBot.execute(args, author);
  }

  case "getraw":
  case "getacc":
  case "getdata":
  case "rawdata":
  case "raw":
  case "dataraw": {
    return await GetDataRaw.execute(args, author, rawMsg);
  }

  case "lastupdate":
  case "timeupdate":
  case "catlock":
  case "locktime":
  case "updatetime":
  case "checkupdate": {
    return await LastUpdate.execute(args, author);
  }

  case "help": {
    return await Help.execute(args, author);
  }

  case "mkinv": {
    return await MkInv.execute(args, author);
  }

  case "mkhook": {
    return await MKHook.execute(args, author);
  }

  case "ping": {
    return await Ping.execute(args, author);
  }

  case "ez": {
    return await EZ.execute(args, author);
  }

  case "updroles": {
    return await UpdateRoles.execute(args, author);
  }

  case "whois":
  case "whoam":
  case "who":
  case "names":
  case "namehist":
  case "whos": {
    return await WhoIS.execute(args, author, rawMsg);
  }

  case "info":
  case "botinfo": {
    return await Info.execute(args, author);
  }

  case "say":
  case "echo": {
    return await Echo.execute(args, author, rawMsg);
  }

  case Blacklist.name.toLowerCase(): {
    return await Blacklist.execute(args, author, rawMsg);
  }

  case CyclePresence.name.toLowerCase(): {
    return await CyclePresence.execute(args, author, rawMsg);
  }

  case Eval.name.toLowerCase(): {
    return await Eval.execute(args, author, rawMsg);
  }

  case Exec.name.toLowerCase(): {
    return await Exec.execute(args, author, rawMsg);
  }

  case Ezmsgs.name.toLowerCase(): {
    return await Ezmsgs.execute(args, author, rawMsg);
  }

  case Hackerlist.name.toLowerCase(): {
    return await Hackerlist.execute(args, author, rawMsg);
  }

  case SetAvatar.name.toLowerCase(): {
    return await SetAvatar.execute(args, author, rawMsg);
  }

  case SetPresence.name.toLowerCase(): {
    return await SetPresence.execute(args, author, rawMsg);
  }

  case SetUsername.name.toLowerCase(): {
    return await SetUsername.execute(args, author, rawMsg);
  }

  case FetchUser.name.toLowerCase(): {
    return await FetchUser.execute(args, author, rawMsg);
  }

  case FetchGuild.name.toLowerCase(): {
    return await FetchGuild.execute(args, author, rawMsg);
  }

  case FetchChannel.name.toLowerCase(): {
    return await FetchChannel.execute(args, author, rawMsg);
  }

  case DBInfo.name.toLowerCase(): {
    return await DBInfo.execute(args, author, rawMsg);
  }

  case "topgames":
  case "top":
  case TopGames.name.toLowerCase(): {
    return await TopGames.execute(args, author, rawMsg);
  }

  case "apiraw" : {
    return await ApiRaw.execute(args, author, rawMsg);
  }

  case "p" :
  case "arcprofile":
  case "arcadeprofile":
  case "profile" : {
    return await Profile.execute(args, author, rawMsg);
  }

  case "mw" : {
    if (author == owner) {
      return await MiniWalls.execute(args, author, rawMsg);
    }

    return { res: "" };
  }

  case "mwlb" : {
    if (author == owner) {
      return await MiniWallsLB.execute(args, author, rawMsg);
    }

    return { res: "" };
  }

  default: {
    Logger.warn(`Nonexistent command "${command.toLowerCase()}" was attempted.`);
    return {
      res: ""
    };
  }
  }
}

export default {
  execute
};
