const { Message } = require("discord.js");
const logger = require("hyarcade-logger");
const linkCmd = require("./Commands/Link");
const MiniWalls = require("./Commands/MiniWalls");
const MiniWallsDev = require("./Commands/MiniWalls-dev");
const MiniWallsCompare = require("./Commands/MiniWallsCompare");
const MiniWallsInvite = require("./Commands/MiniWallsInvite");
const MiniWallsLB = require("./Commands/MiniWallsLB");
const UpdateNames = require("./Commands/UpdateNames");

/**
 * @param {Message} rawMsg
 * @param {string} command
 * @param {string[]} args
 * @param {string} author
 * @returns {object}
 */
async function checkCommands(rawMsg, command, args, author) {
  switch (command.toLowerCase()) {
    case "link":
    case "ln": {
      return await linkCmd.execute(args, author, rawMsg);
    }

    case "dev-s": {
      return await MiniWallsDev.execute(args, author, rawMsg);
    }

    case "s":
    case ".s":
    case "mwstats":
    case "player":
    case "mw":
    case "stats": {
      return await MiniWalls.execute(args, author, rawMsg);
    }

    case "lb":
    case "leaderboard":
    case "mwlb":
    case "mlb":
    case "miniwallsleaderboard":
    case "miniwallslb": {
      return await MiniWallsLB.execute(args, author, rawMsg);
    }

    case "mwcompare":
    case "mwc":
    case "c":
    case "compare":
    case "comparemw": {
      return MiniWallsCompare.execute(args, author, rawMsg);
    }

    case "flb": {
      const { FakeLb } = await import("./Commands/FakeLb.mjs");
      return await FakeLb.execute([], author, rawMsg);
    }

    case "ping": {
      const { Ping } = await import("./Commands/Ping.mjs");
      return await Ping.execute(args, author, rawMsg);
    }

    case "updnames": {
      return await UpdateNames.execute(args, author, rawMsg);
    }

    case "getinvite":
    case "geninvite":
    case "invite": {
      return await MiniWallsInvite.execute(args, author, rawMsg);
    }

    default: {
      logger.out(`Nonexistent command "${command.toLowerCase()}" was attempted.`);
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

module.exports = { execute };
