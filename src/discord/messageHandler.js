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
const { errHypixelMismatch, errIgnNull, linkSuccess } = require("./Embeds");
const SlashHelpTxt = require("./Utils/SlashHelpTxt");
const { Message } = require("discord.js");

const longMsgStr = "**WARNING** Attempted to send a message greater than 2000 characters in length!";

/**
 * 
 * @param {Message} msg 
 * @param {Error} e 
 */
async function logError(msg, e) {
    await BotUtils.errHook.send("Error from - " + msg.content.replace(/`/g, "\\`"));
    await BotUtils.errHook.send(e.toString());
    logger.err("Error from - " + msg.content);
    logger.err(e.toString());
    logger.err(e.stack);
}

async function logCmd(msg) {
    await BotUtils.logCommand(msg.content.split(" ")[0], msg.content.split(" ").slice(1), msg.author.id, msg.url);
    logger.out(`${msg.author.tag} ran : \`${msg.content}\``);
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
        await hook.send(obj);
        return true;
    } catch (e) {
        logger.err(e.toString());
        await BotUtils.errHook.send(e.toString());
        return false;
    }
}

async function miniWallsVerify(msg) {
    let tag = msg.author.tag;
    let id = msg.author.id;
    let ign = msg.content.trim();
    if (await isBlacklisted(id)) return;
    let uuid = await mojangRequest.getUUID(ign);
    if (uuid == undefined) {
        logger.warn("Someone tried to verify as an account that doesn't exist!");
        await msg.channel.send({ embeds: [errIgnNull] });
        return;
    }

    if (Runtime.fromJSON().apiDown) {
        logger.warn("Someone tried to verify while API is down!");
        return { res: "", embed: embeds.apiDed };
    }

    let acc = new Account(ign, 0, uuid);
    await acc.updateData();
    let dbAcc = BotUtils.resolveAccount(uuid, msg, false);
    if (dbAcc.guildID == "608066958ea8c9abb0610f4d" || BotUtils.fileCache.hackers.includes(uuid)) {
        logger.warn("Hacker tried to verify!");
        return;
    }
    if (acc.hypixelDiscord?.toLowerCase() == tag?.toLowerCase()) {
        await addAccounts("others", [uuid]);
        let disclist = BotUtils.fileCache.disclist;
        disclist[id] = uuid;
        await utils.writeJSON("./disclist.json", disclist);
        logger.out(`${tag} was autoverified in miniwalls as ${ign}`);
        await msg.member.roles.remove("850033543425949736");
        await msg.member.roles.add("789721304722178069");
        await msg.member.setNickname(acc.name);
        await msg.channel.send({ embeds: [linkSuccess] });
    } else {
        await msg.channel.send({ embeds: [errHypixelMismatch] });
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
            await msg.channel.send(opts);
        }
    }
}

async function addIGNs(msg) {
    if (cfg.discord.listenChannels.includes(msg.channel.id)) {
        logger.info("IGN channel message detected, automatically adding to database.");
        let firstWord = msg.content.split(" ")[0];
        if (!msg.author.bot && isValidIGN(firstWord)) {
            let acclist = await utils.readJSON("acclist.json");
            let category = acclist[msg.content.split(" ")[1]] != undefined ? msg.content.split(" ")[1] : "others";
            logger.out(firstWord);
            BotUtils.logHook.send('Attempting to add "`' + firstWord + '`" to database.');
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

async function getMWCmdRes(msg) {
    let cmdResponse;
    try {
        cmdResponse = await MiniWallsCommands.execute(msg, msg.author.id);
    } catch (e) {
        await logError(msg, e);
    }

    return cmdResponse;
}

async function isBlacklisted(id) {
    let blacklist = await utils.readJSON("blacklist.json");
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
            let dmchannel = await msg.author.createDM();
            await dmchannel.send(BotUtils.getBlacklistRes());
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
        cmdResponse.res != undefined &&
        (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined);

    if(!isValidResponse) {

        cmdResponse = SlashHelpTxt(msg);

        isValidResponse =
            cmdResponse != undefined &&
            cmdResponse.res != undefined &&
            (cmdResponse.res != "" || cmdResponse.embed != undefined || cmdResponse.img != undefined);
    }


    if (isValidResponse) {
        if (await isBlacklisted(msg.author.id)) {
            let dmchannel = await msg.author.createDM();
            await dmchannel.send(BotUtils.getBlacklistRes());
            return;
        }
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
