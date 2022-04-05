import CommandStorage from "./CommandStorage.mjs";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Message } = require("discord.js");

/**
 * @param {Message} rawMsg
 * @param {string} command
 * @param {string[]} args
 * @param {string} author
 * @returns {object}
 */
async function checkCommands(rawMsg, command, args, author) {
  const commands = await CommandStorage.getCommands();
  switch (command.toLowerCase()) {
    case "link":
    case "ln": {
      return await commands.Link.execute(args, author, rawMsg);
    }

    case "dev-s": {
      return await commands["MiniWalls-dev"].execute(args, author, rawMsg);
    }

    case "s":
    case ".s":
    case "mwstats":
    case "player":
    case "mw":
    case "stats": {
      return await commands.MiniWalls.execute(args, author, rawMsg);
    }

    case "lb":
    case "leaderboard":
    case "mwlb":
    case "mlb":
    case "miniwallsleaderboard":
    case "miniwallslb": {
      return await commands.MiniWallsLB.execute(args, author, rawMsg);
    }

    case "mwcompare":
    case "mwc":
    case "c":
    case "compare":
    case "comparemw": {
      return commands.MiniWallsCompare.execute(args, author, rawMsg);
    }

    case "flb": {
      return await commands.FakeLb.execute([], author, rawMsg);
    }

    case "ping": {
      return await commands.Ping.execute(args, author, rawMsg);
    }

    case "updnames": {
      return await commands.UpdateNames.execute(args, author, rawMsg);
    }

    case "getinvite":
    case "geninvite":
    case "invite": {
      return await commands.MiniWallsInvite.execute(args, author, rawMsg);
    }

    default: {
      return {};
    }
  }
}

/**
 * @param {Message} msg
 * @param {string} senderID
 * @returns {object}
 */
async function execute(msg, senderID) {
  if (msg.content.startsWith(".") && msg.content.length > 1) {
    const cmdArr = msg.content.slice(1).split(" ");
    return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
  }
  return {
    res: "",
  };
}

export default { execute };
