import fs from "fs-extra";
import Logger from "hyarcade-logger";
import Command from "../classes/Command.js";

/**
 * @param {string} mod
 * @returns {Promise<Command>}
 */
async function importNew (mod) {
  return (await import(`./Commands/${mod}?time=${Date.now()}`)).default;
}

class CommandStorage {
  static initalized = false;
  static _commands = { };

  static async initCommands () {
    // eslint-disable-next-line no-undef
    const dir = await fs.readdir("src/discord/Commands");
    
    for(const file of dir) {
      this._commands[file.slice(0, file.indexOf("."))] = await importNew(file);
    }

    this.initalized = true;
  }

  static async execute (string, args, author, rawMsg, interaction) {
    for(const mod in this._commands) {
      if(this._commands[mod].aliases.includes(string.toLowerCase())) {
        return await this._commands[mod].execute(args, author, rawMsg, interaction);
      }
    }

    Logger.warn(`Nonexistent command "${string}" was attempted.`);
    return { res: "" };
  }

  static async getCommands () {
    if(!this.initalized) {
      await this.initCommands();
    }

    return this._commands;
  }
}

export default CommandStorage;