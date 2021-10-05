const linkCmd = require("./Commands/Link");
const logger = require("hyarcade-logger");
const Runtime = require("../Runtime");
const MiniWalls = require("./Commands/MiniWalls");
const MiniWallsLB = require("./Commands/MiniWallsLB");
const MiniWallsCompare = require("./Commands/MiniWallsCompare");
const {
  ERROR_DATABASE_ERROR
} = require("./Utils/Embeds/DynamicEmbeds");
const {
  ERROR_API_DOWN
} = require("./Utils/Embeds/StaticEmbeds");
const {
  Message
} = require("discord.js");
const UpdateNames = require("./Commands/UpdateNames");

/**
 * @param {Message} msg
 * @param {string} senderID
 * @returns {object}
 */
async function execute (msg, senderID) {
  if(msg.content.startsWith(".")) {
    if(Runtime.fromJSON().dbERROR) {
      logger.warn("Someone tried to run a command while the database is corrupted!");
      return {
        res: "",
        embed: ERROR_DATABASE_ERROR
      };
    }
    if(Runtime.fromJSON().apiDown) {
      logger.warn("Someone tried to run a command while the API is down!");
      return {
        res: "",
        embed: ERROR_API_DOWN
      };
    }
    const cmdArr = msg.content.slice(1).split(" ");
    return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
  }
  return {
    res: ""
  };
}

/**
 * @param {Message} rawMsg
 * @param {string} command
 * @param {string[]} args
 * @param {string} author
 * @returns {object}
 */
async function checkCommands (rawMsg, command, args, author) {
  switch(command.toLowerCase()) {
  case "link":
  case "ln": {
    return await linkCmd.execute(args, author, rawMsg);
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
    const {
      FakeLb
    } = await import("./Commands/FakeLb.mjs");
    return await FakeLb.execute(args, author, rawMsg);
  }

  case "ping": {
    const {
      Ping
    } = await import("./Commands/Ping.mjs");
    return await Ping.execute(args, author, rawMsg);
  }

  case "updnames": {
    return await UpdateNames.execute(args, author, rawMsg);
  }

  default: {
    logger.out(`Nonexistent command "${command.toLowerCase()}" was attempted.`);
    return {};
  }
  }
}

module.exports = {
  execute
};
