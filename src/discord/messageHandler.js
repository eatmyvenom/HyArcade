const cfg = require("../Config").fromJSON();
const Runtime = require("../Runtime");
const { addAccounts } = require("../listUtils");
const utils = require("../utils");
const logger = utils.logger;
const isValidIGN = require("../datagen/utils/ignValidator");
const botCommands = require("./botCommands");
const BotUtils = require("./BotUtils");
const Account = require("../classes/account");
const mojangRequest = require("../request/mojangRequest");
const MiniWallsCommands = require("./MiniWallsCommands");
const { ERROR_LINK_HYPIXEL_MISMATCH, ERROR_IGN_UNDEFINED, INFO_LINK_SUCCESS, ERROR_UNKNOWN } = require("./Embeds");
const SlashHelpTxt = require("./Utils/SlashHelpTxt");
const Discord = require("discord.js");
const Message = Discord.Message;
const AdvancedEmbeds = require("./AdvancedEmbeds");
const fs = require("fs-extra");
const Webhooks = require("./Utils/Webhooks");
const LogUtils = require("./Utils/LogUtils");

const longMsgStr = "**WARNING** Attempted to send a message greater than 2000 characters in length!";

/**
 * 
 * @param {Message} msg 
 * @param {Error} e 
 */
async function logError(msg, e) {
    logger.err("Error from - " + msg.content);
    logger.err(e.toString());
    logger.err(e.stack);
    await Webhooks.logHook.send("Error from - " + msg.content.replace(/`/g, "\\`"));
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

async function sendAsHook(hook, cmdResponse) {
    try {
        let obj = BotUtils.getWebhookObj(cmdResponse.embed);
        if (cmdResponse.res != "") {
            obj.content = cmdResponse.res;
        }
        if (cmdResponse.img != undefined) {
            obj.files = [cmdResponse.img];
        }
        logger.debug("Sending response via webhook")
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
    if (await isBlacklisted(id)) return;
    let uuid = await mojangRequest.getUUID(ign);
    if (uuid == undefined) {
        logger.warn("Someone tried to verify as an account that doesn't exist!");
        await msg.channel.send({ embeds: [ERROR_IGN_UNDEFINED] });
        return;
    }

    if (Runtime.fromJSON().apiDown) {
        logger.warn("Someone tried to verify while API is down!");
        return { res: "", embed: embeds.ERROR_API_DOWN };
    }

    let acc = new Account(ign, 0, uuid);
    await acc.updateData();
    let dbAcc = await BotUtils.resolveAccount(uuid, msg, false);
    let hackers = await BotUtils.getFromDB("hackerlist");
    let disclist = await BotUtils.getFromDB("disclist");
    if (dbAcc.guildID == "608066958ea8c9abb0610f4d" || hackers.includes(uuid)) {
        logger.warn("Hacker tried to verify!");
        return;
    }
    if (acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
        await addAccounts("others", [uuid]);
        disclist[id] = uuid;
        await BotUtils.writeToDB("disclist", disclist);
        logger.out(`${tag} was autoverified in miniwalls as ${ign}`);
        await msg.member.roles.remove("850033543425949736");
        await msg.member.roles.add("789721304722178069");
        await msg.member.setNickname(acc.name);
        await msg.channel.send({ embeds: [AdvancedEmbeds.playerLink(acc.name, msg.author)] });
    } else {
        await msg.channel.send({ embeds: [ERROR_LINK_HYPIXEL_MISMATCH] });
    }
}

async function attemptSend(msg, cmdResponse, opts) {
    let runtime = Runtime.fromJSON();
    let hooks = await msg.channel.fetchWebhooks();
    logger.info("Attempting to send response as webhook");
    if (!(hooks.size > 0 && sendAsHook(hooks.first(), cmdResponse))) {
        logger.info("No webhook availiable. Sending normally");
        if (runtime.bot != "backup") {
            opts.reply = { messageReference: msg.id };
            if (cmdResponse.res != "") {
                opts.content = cmdResponse.res;
            }
            if (cmdResponse.embed != undefined) {
                opts.embeds = [cmdResponse.embed];
            }
            if (cmdResponse.img != undefined) {
                opts.files = [cmdResponse.img];
            }
            logger.debug("Sending message via discord bot")
            try {
                await msg.channel.send(opts);
            } catch(e) {
                logError(msg, e);
                await msg.channel.send({ embeds : [ERROR_UNKNOWN]})
            }
        }
    }
}

async function addIGNs(msg) {
    if (cfg.discord.listenChannels.includes(msg.channel.id)) {
        logger.info("IGN channel message detected, automatically adding to database.");
        let firstWord = msg.content.split(" ")[0];
        if (!msg.author.bot && isValidIGN(firstWord)) {
            let acclist = await BotUtils.getFromDB("acclist");
            let category = acclist[msg.content.split(" ")[1]] != undefined ? msg.content.split(" ")[1] : "others";
            logger.out(firstWord);
            Webhooks.logHook.send('Attempting to add "`' + firstWord + '`" to database.');
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
        await Webhooks.errHook.send(longMsgStr);
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
        cmdResponse = ({ res : "", embed : [ERROR_UNKNOWN]});
    }

    return cmdResponse;
}

/**
 * 
 * @param {Message} msg 
 * @returns 
 */
async function getMWCmdRes(msg) {
    let cmdResponse;
    try {
        cmdResponse = await MiniWallsCommands.execute(msg, msg.author.id);
    } catch (e) {
        await logError(msg, e);
        cmdResponse = ({ res : "", embed : [ERROR_UNKNOWN]});
    }

    return cmdResponse;
}

async function isBlacklisted(id) {
    let blacklist = await fs.readFile("data/blacklist");
    blacklist = blacklist.toString().split("\n");
    return blacklist.includes(id);
}

async function mwMode(msg) {
    let cmdResponse = await getMWCmdRes(msg);
    let isValidResponse =
        cmdResponse != undefined &&
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined);
    if (isValidResponse) {
        if (await isBlacklisted(msg.author.id)) {
            return;
        }
        let opts = {};
        if (cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }

        await sanitizeCmdOpt(cmdResponse);

        await attemptSend(msg, cmdResponse, opts);
        await logCmd(msg);
    }
}

/**
 * 
 * @param {Message} msg 
 * @returns 
 */
module.exports = async function messageHandler(msg) {
    if (msg.author.bot) return;
    if (msg.webhookID) return;
    if (msg.guild.id == "808077828842455090") {
        logger.warn("Ignored guild message detected!");
        return;
    }
    if (BotUtils.botMode == "mw") {
        if (msg.channel.id == "791122377333407784") await miniWallsVerify(msg);
        if (msg.guild.id == "789718245015289886" || msg.guild.id == "677552571568619531") {
            await mwMode(msg);
            return;
        } else {
            return;
        }
    }

    let cmdResponse = await getCmdRes(msg);

    let isValidResponse =
        cmdResponse != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined || cmdResponse.silent == true);

    if(!isValidResponse) {

        cmdResponse = SlashHelpTxt(msg);

        isValidResponse =
            cmdResponse != undefined &&
            (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined || cmdResponse.silent == true);
    }


    if (isValidResponse) {
        if (await isBlacklisted(msg.author.id)) {
            return;
        }
        let opts = {};
        if (cmdResponse.embed) {
            opts.embed = cmdResponse.embed;
        }

        await sanitizeCmdOpt(cmdResponse);

        if(!cmdResponse.silent) {
            await attemptSend(msg, cmdResponse, opts);
        }
        await addIGNs(msg);
        await logCmd(msg);
    }

    await LogUtils.logIgns(msg);
};
