const Discord = require("discord.js");
const BotUtils = require("./BotUtils");
const config = require("../../config.json");
const { addAccounts } = require("../listUtils");
const { logger, isValidIGN } = require("../utils");
const botCommands = require("./botCommands");

/**
 * Execute the discord bot
 *
 */
module.exports = function doBot() {
    const client = new Discord.Client();
    let errHook;
    let logHook;

    client.on("ready", async () => {
        let errchannel = await client.channels.fetch(config.discord.errChannel);
        let logchannel = await client.channels.fetch(config.discord.logChannel);
        let errhooks = await errchannel.fetchWebhooks();
        let loghooks = await logchannel.fetchWebhooks();
        errHook = await errhooks.first();
        logHook = await loghooks.first();
        BotUtils.errHook = errHook;
        BotUtils.logHook = logHook;
        logger.out(`Logged in as ${client.user.tag}!`);
        logHook.send(`Logged in as ${client.user.tag}!`);
        client.user.setPresence(config.discord.presence);
    });

    client.on("message", async (msg) => {
        let cmdResponse;
        try {
            cmdResponse = await botCommands.execute(msg, msg.author.id);
        } catch (e) {
            errHook.send("From - " + msg.content.replace(/`/g, "\\`"));
            errHook.send(e.toString());
            logger.err("From - " + msg.content);
            logger.err(e.toString());
        }
        if (
            cmdResponse != undefined &&
            cmdResponse.res != undefined &&
            (cmdResponse.res != "" || cmdResponse.embed != undefined)
        ) {
            logger.out(msg.author.tag + " ran : " + msg.content);
            logHook.send(msg.author.tag + " ran : " + msg.content);
            let opts = {};
            if (cmdResponse.embed) {
                opts.embed = cmdResponse.embed;
            }

            if (cmdResponse.res.length > 2000) {
                cmdResponse.res = cmdResponse.res.slice(0, 2000);
                if (cmdResponse.res.slice(0, 3) == "```") {
                    cmdResponse.res = cmdResponse.res.slice(0, 1994) + "```";
                }
                errHook.send(
                    "**WARNING** Attempted to send a message greater than 2000 characters in length!"
                );
                msg.channel.send(
                    "**WARNING** Attempted to send a message greater than 2000 characters in length!"
                );
                logger.err(
                    "**WARNING** Attempted to send a message greater than 2000 characters in length!"
                );
            }
            let hooks = await msg.channel.fetchWebhooks();
            if (hooks.size > 0) {
                try {
                    let hook = await hooks.first();
                    await hook.send(
                        cmdResponse.res,
                        BotUtils.getWebhookObj(cmdResponse.embed)
                    );
                } catch (e) {
                    logger.err(e.toString());
                    errHook.send(e.toString());
                    msg.channel.send(cmdResponse.res, opts);
                }
            } else {
                msg.channel.send(cmdResponse.res, opts);
            }
        }
        if (config.discord.listenChannels.includes(msg.channel.id)) {
            // sanitize
            let firstWord = msg.content.split(" ")[0];
            if (!msg.author.bot && isValidIGN(firstWord)) {
                let acclist = require("../../acclist.json");
                let category =
                    acclist[msg.content.split(" ")[1]] != undefined
                        ? msg.content.split(" ")[1]
                        : "others";
                logger.out(firstWord);
                logHook.send(
                    'Attempting to add "' + firstWord + '" to database.'
                );
                await addAccounts(category, [firstWord]);
            }
        }
    });

    client.on("rateLimit", (rdta) => {
        logger.err("Bot Rate limited!");
        errHook.send("Rate limited!");
    });

    client.login(config.discord.token);
};
