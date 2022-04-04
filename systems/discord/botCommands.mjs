import config from "@hyarcade/config";
import Logger from "@hyarcade/logger";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const owner = 156952208045375488;
const cfg = config.fromJSON();

import CommandStorage from "./CommandStorage.mjs";
import CommandResponse from "./Utils/CommandResponse.js";

const { Message } = require("discord.js");

/**
 * @param {Message} rawMsg
 * @param {string} command
 * @param {string[]} args
 * @param {string} author
 * @returns {CommandResponse | object}
 */
async function checkCommands(rawMsg, command, args, author) {
  const commands = await CommandStorage.getCommands();
  Logger.debug(`Parsing command ${rawMsg.content}`);
  switch (command.toLowerCase()) {
    case commands.MiniWalls.name.toLowerCase():
    case "mw": {
      if (author == owner) {
        return await commands.MiniWalls.execute(args, author, rawMsg);
      }

      return { res: "" };
    }

    case commands.MiniWallsLB.name.toLowerCase():
    case "mwlb": {
      if (author == owner) {
        return await commands.MiniWallsLB.execute(args, author, rawMsg);
      }

      return { res: "" };
    }

    case commands.MiniWallsInvite.name.toLowerCase(): {
      return { res: "" };
    }

    default: {
      return await CommandStorage.execute(command.toLowerCase(), args, author, rawMsg);
    }
  }
}

/**
 * @param {Message} msg
 * @param {string} senderID
 * @returns {CommandResponse | object}
 */
async function execute(msg, senderID) {
  if (msg.content.startsWith(cfg.commandCharacter)) {
    const cmdArr = msg.content.slice(cfg.commandCharacter.length).split(/\s/g);
    const res = await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    if (res instanceof CommandResponse) {
      return res;
    }
    return new CommandResponse(res);
  }
  return new CommandResponse(undefined, undefined, undefined, undefined, true);
}

export default {
  execute,
};
