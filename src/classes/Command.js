const BotRuntime = require("../discord/BotRuntime");
const logger = require("hyarcade-logger");

module.exports = class Command {
    name = "";
    allowed = [];
    callback = async function () {
      return {
        res: "command broke"
      };
    };

    constructor (name, allowed, callback) {
      this.name = name;
      this.allowed = allowed;
      this.callback = callback;
    }

    async execute (args, author, rawMsg, interaction) {
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
