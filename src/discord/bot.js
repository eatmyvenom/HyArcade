const Discord = require("discord.js");
const config = require("../../config.json");
const { addAccounts } = require("../listUtils");
const { logger } = require("../utils");

module.exports = function doBot() {
    const client = new Discord.Client();

    function isValidIGN(txt) {
        return (
            txt.length < 17 &&
            txt.length > 2 &&
            !txt.includes("!") &&
            !txt.includes("?") &&
            !txt.includes("<") &&
            !txt.includes(";") &&
            !txt.includes('"') &&
            txt != "liar" &&
            txt != "pog" &&
            txt != "fuck" &&
            txt != "yes" &&
            txt != "knew" &&
            txt != "hot" &&
            txt != "ofc" &&
            txt != "get" &&
            txt != "are" &&
            txt != "gamer" && 
            txt != "yea" && 
            txt != "okay"
        );
    }

    client.on("ready", () => {
        logger.out(`Logged in as ${client.user.tag}!`);
    });

    client.on("message", async (msg) => {
        if (config.discord.listenChannels.includes(msg.channel.id)) {
            // sanitize
            let firstWord = msg.content.split(" ")[0];
            if (!msg.author.bot && isValidIGN(firstWord)) {
                logger.out(firstWord);
                await addAccounts("gamers", [firstWord]);
            }
        }
    });

    client.login(config.discord.token);
};
