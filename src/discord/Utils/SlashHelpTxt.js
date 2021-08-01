/**
 * 
 * @param {Message} msg 
 */
module.exports = function SlashHelpTxt(msg) {
    if(msg.content.startsWith("/")) {
        let firstWord = msg.content.split(" ")[0].slice(1).toLowerCase();
        switch(firstWord) {
        case "leaderboard":
        case "arcadehelp":
        case "arcade":
        case "help":
        case "verify":
        case "ez":
        case "stats":
        case "top-games":
        case "topgames":
        case "get-data-raw":
        case "whois": {
            return {
                res: "https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ"
            };
        }
        }
    }
};
