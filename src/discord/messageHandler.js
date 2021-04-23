const cfg = require("../Config").fromJSON();
const { WebhookClient } = require("discord.js");
const { addAccounts } = require("../listUtils");
const utils = require("../utils");
const { isValidIGN, logger } = require("../utils");
const botCommands = require("./botCommands");
const BotUtils = require("./BotUtils");

const longMsgStr =
    "**WARNING** Attempted to send a message greater than 2000 characters in length!";

async function logError(msg, e) {
    await BotUtils.errHook.send(
        "Error from - " + msg.content.replace(/`/g, "\\`")
    );
    await BotUtils.errHook.send(e.toString());
    logger.err("Error from - " + msg.content);
    logger.err(e.toString());
}

async function logCmd(msg) {
    await BotUtils.logcopy(msg, BotUtils.msgCopyHook);
    logger.out(`${msg.author.tag} ran : \`${msg.content}\``);
}

async function attemptSend(msg, cmdResponse, opts) {
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
            await BotUtils.errHook.send(e.toString());
            await msg.channel.send(cmdResponse.res, opts);
        }
    } else {
        await msg.channel.send(cmdResponse.res, opts);
    }
}

async function addIGNs(msg) {
    if (cfg.discord.listenChannels.includes(msg.channel.id)) {
        // sanitize
        let firstWord = msg.content.split(" ")[0];
        if (!msg.author.bot && isValidIGN(firstWord)) {
            let acclist = await utils.readJSON("./acclist.json");
            let category =
                acclist[msg.content.split(" ")[1]] != undefined
                    ? msg.content.split(" ")[1]
                    : "others";
            logger.out(firstWord);
            BotUtils.logHook.send(
                'Attempting to add "`' + firstWord + '`" to database.'
            );
            await addAccounts(category, [firstWord]);
        }
    }
}

async function sanitizeCmdOpt(cmdResponse) {
    if (cmdResponse.res.length > 2000) {
        cmdResponse.res = cmdResponse.res.slice(0, 2000);
        if (cmdResponse.res.slice(0, 3) == "```") {
            cmdResponse.res = cmdResponse.res.slice(0, 1994) + "```";
        }
        await BotUtils.errHook.send(longMsgStr);
        await msg.channel.send(longMsgStr);
        logger.err(longMsgStr);
    }
    return cmdResponse;
}

async function getCmdRes(msg) {
    let cmdResponse;
    try {
        cmdResponse = await botCommands.execute(msg, msg.author.id);
    } catch (e) {
        await logError(msg, e);
    }

    return cmdResponse;
}

module.exports = async function messageHandler(msg) {

    if(msg.author.bot) return;
    if(msg.webhookID) return;

    let cmdResponse = await getCmdRes(msg);

    let isValidResponse = cmdResponse != undefined &&
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined);

    if (isValidResponse) {
        
        let opts = {};
        if (cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }
        
        await sanitizeCmdOpt(cmdResponse);
        
        await attemptSend(msg, cmdResponse, opts);
        await addIGNs(msg);
        await logCmd(msg);
    }
    
    await BotUtils.logIgns(msg);
};
