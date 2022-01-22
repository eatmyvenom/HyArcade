const {
  Message
} = require("discord.js");
const { INFO_HOW_TO_SLASH } = require("./Embeds/StaticEmbeds");

/**
 * 
 * @param {Message} msg
 * @returns {string}
 */
module.exports = function SlashHelpTxt (msg) {
  if(msg.content.startsWith("/")) {
    const firstWord = msg.content.split(" ")[0].slice(1).toLowerCase();
    switch(firstWord) {
    case "leaderboard":
    case "arcadehelp":
    case "arcade":
    case "help":
    case "verify":
    case "stats":
    case "top-games":
    case "topgames":
    case "whois": {
      return {
        res: "",
        embed: INFO_HOW_TO_SLASH
      };
    }
    }
  }
};
