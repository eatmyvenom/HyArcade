const cfg = require("../Config").fromJSON();
const utils = require("../utils");
const { isValidIGN, logger } = require("../utils");
const botCommands = require("./botCommands");
const BotUtils = require("./BotUtils");

const longMsgStr =
    "**WARNING** Attempted to send a message greater than 2000 characters in length!";

module.exports = async function messageHandler(msg) {
    let cmdResponse;
    try {
        cmdResponse = await botCommands.execute(msg, msg.author.id);
    } catch (e) {
        BotUtils.errHook.send(
            "Error from - " + msg.content.replace(/`/g, "\\`")
        );
        BotUtils.errHook.send(e.toString());
        logger.err("Error from - " + msg.content);
        logger.err(e.toString());
    }
    if (
        cmdResponse != undefined &&
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined)
    ) {
        logger.out(msg.author.tag + " ran : " + msg.content);
        BotUtils.logHook.send(msg.author.tag + " ran : " + msg.content);
        let opts = {};
        if (cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }

        if (cmdResponse.res.length > 2000) {
            cmdResponse.res = cmdResponse.res.slice(0, 2000);
            if (cmdResponse.res.slice(0, 3) == "```") {
                cmdResponse.res = cmdResponse.res.slice(0, 1994) + "```";
            }
            BotUtils.errHook.send(longMsgStr);
            msg.channel.send(longMsgStr);
            logger.err(longMsgStr);
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
                BotUtils.errHook.send(e.toString());
                msg.channel.send(cmdResponse.res, opts);
            }
        } else {
            msg.channel.send(cmdResponse.res, opts);
        }
    }
    if (cfg.discord.listenChannels.includes(msg.channel.id)) {
        // sanitize
        let firstWord = msg.content.split(" ")[0];
        if (!msg.author.bot && isValidIGN(firstWord)) {
            let acclist = utils.readJSON("./acclist.json");
            let category =
                acclist[msg.content.split(" ")[1]] != undefined
                    ? msg.content.split(" ")[1]
                    : "others";
            logger.out(firstWord);
            BotUtils.logHook.send(
                'Attempting to add "' + firstWord + '" to database.'
            );
            await addAccounts(category, [firstWord]);
        }
    }
};
