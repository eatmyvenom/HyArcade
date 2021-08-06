const cfg = require("hyarcade-config").fromJSON();
const Runtime = require("hyarcade-config/Runtime");
const {
    addAccounts
} = require("../listUtils");
const logger = require("hyarcade-logger");
const isValidIGN = require("../datagen/utils/ignValidator");
const botCommands = require("./botCommands");
const BotUtils = require("./BotUtils");
const Account = require("hyarcade-requests").types.Account;
const mojangRequest = require("hyarcade-requests").mojangRequest;
const MiniWallsCommands = require("./MiniWallsCommands");
const SlashHelpTxt = require("./Utils/SlashHelpTxt");
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const {
    ERROR_LINK_HYPIXEL_MISMATCH,
    ERROR_IGN_UNDEFINED,
    ERROR_UNKNOWN,
    ERROR_API_DOWN
} = require("./Utils/Embeds/StaticEmbeds");
const fs = require("fs-extra");
const Webhooks = require("./Utils/Webhooks");
const LogUtils = require("./Utils/LogUtils");
const CommandResponse = require("./Utils/CommandResponse");
const {
    Message,
    Collection,
    Webhook
} = require("discord.js");

const longMsgStr = "**WARNING** Attempted to send a message greater than 2000 characters in length!";

/**
 * 
 * @param {Message} msg 
 * @param {Error} e 
 */
async function logError(msg, e) {
    logger.err(`Error from - ${msg.content}`);
    logger.err(e.toString());
    logger.err(e.stack);
    await Webhooks.logHook.send(`Error from - ${msg.content.replace(/\\?`/g, "\\`")}`);
    await Webhooks.errHook.send(e.toString());
}

/**
 * 
 * @param {Message} msg 
 */
async function logCmd(msg) {
    await LogUtils.logCommand(msg.content.split(" ")[0], msg.content.split(" ").slice(1), msg);
    logger.out(`${msg.author.tag} ran : ${msg.cleanContent}`);
}

/**
 * @param {string} hook
 * @param {object} cmdResponse
 * @returns {boolean}
 */
async function sendAsHook(hook, cmdResponse) {
    try {
        let obj = BotUtils.getWebhookObj(cmdResponse.embed);
        if(cmdResponse.res != "") {
            obj.content = cmdResponse.res;
        }
        if(cmdResponse.img != undefined) {
            obj.files = [cmdResponse.img];
        }
        logger.debug("Sending response via webhook");
        await hook.send(obj);
        return true;
    } catch (e) {
        logger.err(e.toString());
        await Webhooks.errHook.send(e.toString());
        return false;
    }
}

/**
 * 
 * @param {Message} msg 
 * @returns {null}
 */
async function miniWallsVerify(msg) {
    let tag = msg.author.tag;
    let id = msg.author.id;
    let ign = msg.content.trim();
    if(await isBlacklisted(id)) return;
    let uuid = await mojangRequest.getUUID(ign);
    if(uuid == undefined) {
        logger.warn("Someone tried to verify as an account that doesn't exist!");
        await msg.channel.send({
            embeds: [ERROR_IGN_UNDEFINED]
        });
        return;
    }

    if(Runtime.fromJSON().apiDown) {
        logger.warn("Someone tried to verify while API is down!");
        return {
            res: "",
            embed: ERROR_API_DOWN
        };
    }

    let acc = new Account(ign, 0, uuid);
    await acc.updateData();
    let dbAcc = await BotUtils.resolveAccount(uuid, msg, false);
    let hackers = await BotUtils.getFromDB("hackerlist");
    let disclist = await BotUtils.getFromDB("disclist");
    if(dbAcc.guildID == "608066958ea8c9abb0610f4d" || hackers.includes(uuid)) {
        logger.warn("Hacker tried to verify!");
        return;
    }
    if(acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
        await addAccounts("others", [uuid]);
        disclist[id] = uuid;
        await BotUtils.writeToDB("disclist", disclist);
        logger.out(`${tag} was autoverified in miniwalls as ${ign}`);
        await msg.member.roles.remove("850033543425949736");
        await msg.member.roles.add("789721304722178069");
        await msg.member.setNickname(acc.name);
        await msg.channel.send({
            embeds: [AdvancedEmbeds.playerLink(acc.name, msg.author)]
        });
    } else {
        await msg.channel.send({
            embeds: [ERROR_LINK_HYPIXEL_MISMATCH]
        });
    }
}

/**
 * @param {Message} msg
 * @param {object} cmdResponse
 * @param {object} opts
 */
async function attemptSend(msg, cmdResponse, opts) {
    let runtime = Runtime.fromJSON();
    let hooks = await msg.channel.fetchWebhooks();
    logger.info("Attempting to send response as webhook");
    if(!(hooks.size > 0 && sendAsHook(hooks.first(), cmdResponse))) {
        logger.info("No webhook availiable. Sending normally");
        if(runtime.bot != "backup") {
            opts.reply = {
                messageReference: msg.id
            };
            if(cmdResponse.res != "") {
                opts.content = cmdResponse.res;
            }
            if(cmdResponse.embed != undefined) {
                opts.embeds = [cmdResponse.embed];
            }
            if(cmdResponse.img != undefined) {
                opts.files = [cmdResponse.img];
            }
            logger.debug("Sending message via discord bot");
            try {
                await msg.channel.send(opts);
            } catch (e) {
                logError(msg, e);
                await msg.channel.send({
                    embeds: [ERROR_UNKNOWN]
                });
            }
        }
    }
}

/**
 * @param {Message} msg
 */
async function addIGNs(msg) {
    if(cfg.discord.listenChannels.includes(msg.channel.id)) {
        logger.info("IGN channel message detected, automatically adding to database.");
        let firstWord = msg.content.split(" ")[0];
        if(!msg.author.bot && isValidIGN(firstWord)) {
            let acclist = await BotUtils.getFromDB("acclist");
            let category = acclist[msg.content.split(" ")[1]] != undefined ? msg.content.split(" ")[1] : "others";
            logger.out(firstWord);
            Webhooks.logHook.send(`Attempting to add "\`${firstWord}\`" to database.`);
            await addAccounts(category, [firstWord]);
        }
    }
}

/**
 * @param {object} cmdResponse
 * @returns {object}
 */
async function sanitizeCmdOpt(cmdResponse) {
    if(cmdResponse.res?.length > 2000) {
        cmdResponse.res = cmdResponse.res.slice(0, 2000);
        if(cmdResponse.res.slice(0, 3) == "```") {
            cmdResponse.res = `${cmdResponse.res.slice(0, 1994)}\`\`\``;
        }
        await Webhooks.errHook.send(longMsgStr);
        logger.err(longMsgStr);
    }
    return cmdResponse;
}

/**
 * @param {Message} msg
 * @returns {CommandResponse | object}
 */
async function getCmdRes(msg) {
    let cmdResponse;
    try {
        cmdResponse = await botCommands.execute(msg, msg.author.id);
    } catch (e) {
        await logError(msg, e);
        cmdResponse = ({
            res: "",
            embed: [ERROR_UNKNOWN]
        });
    }

    return cmdResponse;
}

/**
 * 
 * @param {Message} msg 
 * @returns {object}
 */
async function getMWCmdRes(msg) {
    let cmdResponse;
    try {
        cmdResponse = await MiniWallsCommands.execute(msg, msg.author.id);
    } catch (e) {
        await logError(msg, e);
        cmdResponse = ({
            res: "",
            embed: [ERROR_UNKNOWN]
        });
    }

    return cmdResponse;
}

/**
 * @param {string} id
 * @returns {boolean}
 */
async function isBlacklisted(id) {
    let blacklist = await fs.readFile("data/blacklist");
    blacklist = blacklist.toString().split("\n");
    return blacklist.includes(id);
}

/**
 * 
 * @param {Message} msg 
 * @param {CommandResponse} cmdResponse 
 */
async function sendText(msg, cmdResponse) {
    let runtime = Runtime.fromJSON();
    if(runtime.bot != "backup") {
        logger.info("No webhook availiable. Sending normally");
        try {
            let msgObj = cmdResponse.toDiscord({
                messageReference: msg.id
            });
            await msg.channel.send(msgObj);
        } catch (e) {
            logError(msg, e);
            await msg.channel.send({
                embeds: [ERROR_UNKNOWN]
            });
        }
    }
}

/**
 * 
 * @param {Message} msg 
 * @param {CommandResponse} cmdResponse 
 */
async function sendNormal(msg, cmdResponse) {
    /**
     * @type {Collection<string, Webhook>}
     */
    let hooks;
    try {
        hooks = await msg.channel.fetchWebhooks();
    } catch (e) {
        await sendText(msg, cmdResponse);
    }
    logger.info("Attempting to send response as webhook");

    if(hooks.size > 0) {
        let hook = hooks.first();
        try {
            await hook.send(cmdResponse.toDiscord(undefined, true));
        } catch (e) {
            await sendText(msg, cmdResponse);
        }
    } else {
        await sendText(msg, cmdResponse);
    }
}

/**
 * @param {Message} msg
 */
async function mwMode(msg) {
    let cmdResponse = await getMWCmdRes(msg);
    let isValidResponse =
        cmdResponse != undefined &&
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined);
    if(isValidResponse) {
        if(await isBlacklisted(msg.author.id)) {
            return;
        }
        let opts = {};
        if(cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }

        await sanitizeCmdOpt(cmdResponse);

        await attemptSend(msg, cmdResponse, opts);
        await logCmd(msg);
    }
}

/**
 * @param {object} cmdResponse
 * @returns {boolean}
 */
function checkResponse(cmdResponse) {
    return cmdResponse != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined || cmdResponse.silent == true);
}

/**
 * 
 * @param {Message} msg 
 * @param {object | CommandResponse} cmdResponse 
 * @param {boolean} isDiscordResponse
 */
async function handleCommand(msg, cmdResponse, isDiscordResponse) {
    if(await isBlacklisted(msg.author.id)) {
        return;
    }

    if(isDiscordResponse) {
        if(!cmdResponse.silent) {
            await sendNormal(msg, cmdResponse);
        }
    } else {
        let opts = {};
        if(cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }
        await sanitizeCmdOpt(cmdResponse);
        if(!cmdResponse.silent) {
            await attemptSend(msg, cmdResponse, opts);
        }
    }
    await logCmd(msg);
}

/**
 * @param {Message} msg
 */
async function checkMW(msg) {
    if(msg.channel.id == "791122377333407784") await miniWallsVerify(msg);
    if(msg.guild.id == "789718245015289886" || msg.guild.id == "677552571568619531") {
        await mwMode(msg);
        return;
    } else {
        return;
    }
}

/**
 * 
 * @param {Message} msg 
 */
module.exports = async function messageHandler(msg) {
    if(msg.author.bot) return;
    if(msg.webhookID) return;
    if(msg.guild.id == "808077828842455090") {
        logger.warn("Ignored guild message detected!");
        return;
    }

    if(BotUtils.botMode == "mw" || BotUtils.botMode == "test") {
        await checkMW(msg);
        if(BotUtils.botMode == "mw") {
            return;
        }
    }

    let cmdResponse = await getCmdRes(msg);
    let isValidResponse = false;
    let isDiscordResponse = false;

    if(cmdResponse instanceof CommandResponse && cmdResponse.isValid()) {
        isValidResponse = true;
        isDiscordResponse = true;
    } else {
        isValidResponse = checkResponse(cmdResponse);
        if(!isValidResponse) {
            cmdResponse = SlashHelpTxt(msg);
            isValidResponse = checkResponse(cmdResponse);
        }
    }

    if(isValidResponse) {
        await handleCommand(msg, cmdResponse, isDiscordResponse);
    }

    await addIGNs(msg);
    await LogUtils.logIgns(msg);
};
