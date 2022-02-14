const { Message } = require("discord.js");
const { Interaction } = require("discord.js");
const fs = require("fs-extra");
const logger = require("hyarcade-logger");
const Logger = require("hyarcade-logger");
const CommandResponse = require("./CommandResponse");

let trustedUsers;

module.exports = class Command {
  name = "";
  aliases = [];
  allowed = [];
  rateLimit = 7500;
  executors = {};

  constructor(aliases, allowed, callback, rateLimit = 5000) {
    if (Array.isArray(aliases)) {
      this.name = aliases[0];
      this.aliases = aliases;
    } else {
      this.name = aliases;
      this.aliases = [aliases];
    }
    this.allowed = allowed;
    this.callback = callback;
    this.rateLimit = rateLimit;
  }

  async callback(args, rawMsg, interaction) {
    Logger.debug(`Command Run\nName : ${this.name}\nArgs : ${args}\nMessage : ${rawMsg.content}\nInteraction? : ${interaction != undefined}`);
    return new CommandResponse("Bot broke :(");
  }

  /**
   *
   * @param {*} args
   * @param {*} author
   * @param {Message} rawMsg
   * @param {Interaction} interaction
   * @returns {CommandResponse}
   */
  async execute(args, author, rawMsg, interaction) {
    if (trustedUsers == undefined) {
      const trustedFile = await fs.readFile("data/trustedUsers");
      const tus = trustedFile.toString().trim().split("\n");

      trustedUsers = tus;
    }

    let rate = this.rateLimit;

    if (interaction != undefined && !interaction.isCommand() && interaction.isMessageComponent()) {
      rate = Math.max(this.rateLimit / 4, 1000);
    }

    if (trustedUsers.includes(author) || author == "156952208045375488") {
      rate = 0;
    }

    if (Date.now() - this.executors[author] < rate) {
      logger.warn(`${author} has been rate limited for ${this.name}`);
      if (interaction != undefined) {
        if (interaction.isCommand()) {
          return new CommandResponse("Sorry, you can't run this command yet. Please wait a few seconds!", undefined, undefined, undefined, false, true);
        }
        if (!interaction.deferred) {
          await interaction.deferUpdate();
        }
        return;
      }
      return new CommandResponse("Sorry, you can't run this command yet. Please wait a few seconds!", undefined, undefined, undefined);
    }
    this.executors[author] = Date.now();

    if (this.allowed.includes("%trusted%")) {
      this.allowed = [...this.allowed, ...trustedUsers];
      this.allowed = this.allowed.filter(t => t != "%trusted%");
    }
    if (!this.allowed.includes(author) && !this.allowed.includes("*")) {
      logger.info(`${author} tried to run the ${this.name} command without permissions... only ${this.allowed.toString()} are allowed`);
      return {
        res: "",
      };
    }
    return await this.callback(args, rawMsg, interaction);
  }
};
