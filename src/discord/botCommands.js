import { default as config } from "hyarcade-config";
const cfg = config.fromJSON();
import { default as Logger } from "hyarcade-logger";
import { default as Runtime } from "hyarcade-config/Runtime";
const owner = "156952208045375488";

import { default as Link } from "./Commands/Link";
import Verify from "./Commands/LinkMe.mjs";
import { default as LastUpdate } from "./Commands/LastUpdate";
import KillBot from "./Commands/KillBot.mjs";
import { default as MkInv } from "./Commands/MakeInviteEmbed";
import { default as MKHook } from "./Commands/MakeHook";
import { default as UpdateRoles } from "./Commands/UpdateRoles";
import Info from "./Commands/Info.mjs";
import EZ from "./Commands/EZ.mjs";
import Ping from "./Commands/Ping.mjs";
import Echo from "./Commands/Echo.mjs";
import Blacklist from "./Commands/Blacklist.mjs";
import CyclePresence from "./Commands/CyclePresence.mjs";
import Eval from "./Commands/Eval.mjs";
import Ezmsgs from "./Commands/ezmsgs.mjs";
import Hackerlist from "./Commands/Hackerlist.mjs";
import { default as SetAvatar } from "./Commands/SetAvatar";
import { default as SetPresence } from "./Commands/SetPresence";
import { default as SetUsername } from "./Commands/SetUsername";
import Exec from "./Commands/Exec";
import { default as FetchUser } from "./Commands/FetchUser";
import { default as FetchGuild } from "./Commands/FetchGuild";
import { default as FetchChannel } from "./Commands/FetchChannel";
import TopGames from "./Commands/TopGames.mjs";
import { default as DBInfo } from "./Commands/DBInfo";
import { default as Help } from "./Commands/Help";

import CommandResponse from "./Utils/CommandResponse";
import { ERROR_DATABASE_ERROR, ERROR_USE_SLASH_COMMAND } from "./Utils/Embeds/DynamicEmbeds";
import { ERROR_API_DOWN } from "./Utils/Embeds/StaticEmbeds";
import { Message } from "discord.js";

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
    const cmdArr = msg.content.slice(1).split(" ");
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

  case "newacc":
  case "addacc":
    return {
      res: "", embed: ERROR_USE_SLASH_COMMAND("addacc", "addaccount")
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
  case "dataraw": {
    return {
      res: "",
      embed: ERROR_USE_SLASH_COMMAND("getdataraw", "getdataraw")
    };
  }

  case "players":
  case "amnts":
  case "plrs":
  case "counts":
  case "amounts":
  case "gamecounts": {
    return {
      res: "",
      embed: ERROR_USE_SLASH_COMMAND("gamecounts", "gamecounts")
    };
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

  case "names":
  case "namehist":
  case "namehistory": {
    return {
      res: "",
      embed: ERROR_USE_SLASH_COMMAND("namehistory", "whois")
    };
  }

  case "whois":
  case "whoam":
  case "whos": {
    return {
      res: "",
      embed: ERROR_USE_SLASH_COMMAND("whois", "whois")
    };
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

  case TopGames.name.toLowerCase(): {
    if(author == owner) {
      return await TopGames.execute(args, author, rawMsg);
    }
    return new CommandResponse("", ERROR_USE_SLASH_COMMAND("topgames", "top-games"));
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
