const { Message } = require("discord.js")

/**
 * 
 * @param {Message} msg 
 */
module.exports = function SlashHelpTxt(msg) {
    if(msg.content.startsWith("/")) {
        let firstWord = msg.content.split(" ")[0].slice(1).toLowerCase();
        switch(firstWord) {
            case "leaderboard":
            case "lb":
            case "arcadehelp":
            case "help":
            case "stats":
            case "getdataraw":
            case "whois": {
                return { res : "https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ" }
            }
        }
    }
}