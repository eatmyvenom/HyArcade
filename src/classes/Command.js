const BotRuntime = require("../discord/BotRuntime");
const logger = require("hyarcade-logger");
const { Message } = require("discord.js");
const { Interaction } = require("discord.js");
const CommandResponse = require("../discord/Utils/CommandResponse");

module.exports = class Command {
    name = "";
    aliases = [];
    allowed = [];
    callback = async function () {
      return {
        res: "command broke :(!"
      };
    };
    rateLimit = 5000;
    executors = {};

    constructor (aliases, allowed, callback, rateLimit = 5000) {
      if(Array.isArray(aliases)) {
        this.name = aliases[0];
        this.aliases = aliases;
      } else {
        this.name = aliases;
        this.aliases = [ aliases ];
      }
      this.allowed = allowed;
      this.callback = callback;
      this.rateLimit = rateLimit;
    }

    /**
     * 
     * @param {*} args 
     * @param {*} author 
     * @param {Message} rawMsg 
     * @param {Interaction} interaction 
     * @returns {*}
     */
    async execute (args, author, rawMsg, interaction) {
      let rate = this.rateLimit;

      if(interaction != undefined && !interaction.isCommand()) {
        if(interaction.isMessageComponent()) {
          rate = Math.max(this.rateLimit / 4, 1000);
        }
      }

      if(BotRuntime.trustedUsers.includes(author) || author == "156952208045375488") {
        rate = 0;
      }

      if(Date.now() - this.executors[author] < rate) {
        logger.warn(`${author} has been rate limited for ${this.name}`);
        if(interaction != undefined) {
          if(interaction.isCommand()) {
            return new CommandResponse("Sorry, you can't run this command yet. Please wait a few seconds!", undefined, undefined, undefined, false, true);
          }
          await interaction.deferUpdate();
          return;
        }
        return new CommandResponse("Sorry, you can't run this command yet. Please wait a few seconds!", undefined, undefined, undefined);
      }
      this.executors[author] = Date.now();

      if(this.allowed.includes("%trusted%")) {
        this.allowed = this.allowed.concat(BotRuntime.trustedUsers);
        this.allowed = this.allowed.filter((t) => t != "%trusted%");
      }
      if(!this.allowed.includes(author) && !this.allowed.includes("*")) {
        logger.info(`${author} tried to run the ${this.name} command without permissions... only ${this.allowed.toString()} are allowed`);
        return {
          res: ""
        };
      }
      return await this.callback(args, rawMsg, interaction);
    }
};
