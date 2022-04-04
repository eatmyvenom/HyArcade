import { CommandInteraction } from "discord.js";
import fs from "fs-extra";
import Logger from "@hyarcade/logger";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import path from "node:path";
import { URL } from "node:url";

const __dirname = new URL(".", import.meta.url).pathname;

/**
 * @param {string} mod
 * @returns {Promise<Command>}
 */
async function importNew(mod) {
  const importedMod = await import(`./Commands/${mod}?time=${Date.now()}`);
  return importedMod.default;
}

class CommandStorage {
  static initalized = false;
  static _commands = {};

  static async initCommands() {
    // eslint-disable-next-line no-undef
    const dir = await fs.readdir(path.join(__dirname, "Commands"));

    for (const file of dir) {
      this._commands[file.slice(0, file.indexOf("."))] = await importNew(file);
    }

    this.initalized = true;
  }

  static async execute(string, args, author, rawMsg, interaction) {
    for (const mod in this._commands) {
      if (this._commands[mod].aliases.includes(string.toLowerCase())) {
        return await this._commands[mod].execute(args, author, rawMsg, interaction);
      }
    }

    Logger.warn(`Nonexistent command "${string}" was attempted.`);
    return { res: "" };
  }

  /**
   *
   * @param {string} name
   * @param {CommandInteraction} interaction
   * @returns {CommandResponse}
   */
  static async execInteraction(name, interaction) {
    let args = [];
    args = interaction.options?.data[0]?.options
      ? interaction.options.data[0].options?.map(c => c.value)
      : interaction.options.data.map(c => c.value);

    for (const mod in this._commands) {
      if (this._commands[mod].aliases.includes(name.toLowerCase())) {
        // eslint-disable-next-line unicorn/no-null
        return await this._commands[mod].execute(args, interaction.member.id, null, interaction);
      }
    }
  }

  static async getCommands() {
    if (!this.initalized) {
      await this.initCommands();
    }

    return this._commands;
  }
}

export default CommandStorage;
