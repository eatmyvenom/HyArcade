const cfg = require("../Config").fromJSON();
const { WebhookClient } = require("discord.js");
const Runtime = require("../Runtime");
const utils = require("../utils");
const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const registerSlashCommands = require("./registerSlashCommands");
const roleHandler = require("./roleHandler");
const fs = require("fs/promises");

module.exports = class BotEvents {
    static async rateLimit(rlInfo) {
        let timeout = rlInfo.timeout;
        let str = `Bot rate limited\nTime : ${timeout}\nCause : ${rlInfo.method.toUpperCase()} - ${rlInfo.path}\n`;
        logger.err(str);
        await BotUtils.errHook.send(str);
    }

    static async messageDelete(msg) {
        if (msg.content.charAt(0) == cfg.commandCharacter) {
            let str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
            logger.out(str);
            await BotUtils.errHook.send(str);
        }
    }

    static async ready(mode) {
        BotUtils.isBotInstance = true;
        BotUtils.botMode = mode;
        logger.out("Fetching logging channels");
        let errchannel = await BotUtils.client.channels.fetch(cfg.discord.errChannel);
        let logchannel = await BotUtils.client.channels.fetch(cfg.discord.logChannel);
        let errhooks = await errchannel.fetchWebhooks();
        let loghooks = await logchannel.fetchWebhooks();
        let errHook = await errhooks.first();
        let logHook = await loghooks.first();
        BotUtils.errHook = errHook;
        BotUtils.logHook = logHook;
        BotUtils.msgCopyHook = new WebhookClient(cfg.loggingHooks.copyHook.id, cfg.loggingHooks.copyHook.token);
        logger.out("Initializing file cache");
        BotUtils.fileCache.acclist = await utils.readJSON("accounts.json");
        BotUtils.fileCache.disclist = await utils.readJSON("disclist.json");
        BotUtils.fileCache.status = await utils.readJSON("status.json");
        BotUtils.fileCache.updatetime = await fs.readFile("timeupdate");
        BotUtils.fileCache.dayacclist = await utils.readJSON("accounts.day.json");
        BotUtils.fileCache.weeklyacclist = await utils.readJSON("accounts.weekly.json");
        BotUtils.fileCache.monthlyacclist = await utils.readJSON("accounts.monthly.json");
        let hackers = await fs.readFile("data/hackerlist");
        hackers = hackers.toString().split("\n");

        BotUtils.fileCache.hackers = hackers;
        let ezmsgs = await fs.readFile("data/ez");
        ezmsgs = ezmsgs.toString().split("\n");
        BotUtils.fileCache.ezmsgs = ezmsgs;
        logger.out("Selecting mode");
        if (mode == "role") {
            await roleHandler(BotUtils.client);
            await BotUtils.client.destroy();
        } else if (mode == "slash") {
            await registerSlashCommands(BotUtils.client);
            logger.out(`Logged in as ${BotUtils.client.user.tag} - Slash command handler`);
            logHook.send(`Logged in as ${BotUtils.client.user.tag} - Slash command handler`);
        } else if (BotUtils.botMode == "mw") {
            logger.out(`Logged in as ${BotUtils.client.user.tag} - MW module`);
            logHook.send(`Logged in as ${BotUtils.client.user.tag} - MW module`);
        } else {
            logger.out(`Logged in as ${BotUtils.client.user.tag}!`);
            logHook.send(`Logged in as ${BotUtils.client.user.tag}!`);
            BotUtils.client.user.setPresence(cfg.discord.presence);
        }
    }

    static async tick() {
        let runtime = Runtime.fromJSON();
        if (runtime.needRoleupdate && BotUtils.botMode == undefined) {
            await roleHandler(BotUtils.client);
            await BotUtils.logHook.send("Roles Updated");
            runtime.needRoleupdate = false;
            await runtime.save();
        }
    }

    static async heartBeat() {
        let runtime = Runtime.fromJSON();
        runtime[BotUtils.botMode + "HeartBeat"] = Date.now();
        await runtime.save();
        logger.out("Heart beat - I'm alive!");
    }

    static async dataRefresh() {
        logger.out("Refreshing file cache...");
        let run = Runtime.fromJSON();
        let error = false;
        let dayacclist, weeklyacclist, monthlyacclist, acclist, disclist, status, updatetime, hackers, ezmsgs;
        try {
            dayacclist = await utils.readJSON("accounts.day.json");
            weeklyacclist = await utils.readJSON("accounts.weekly.json");
            monthlyacclist = await utils.readJSON("accounts.monthly.json");
            acclist = await utils.readJSON("accounts.json");
            disclist = await utils.readJSON("disclist.json");
            status = await utils.readJSON("status.json");
            updatetime = await fs.readFile("timeupdate");
            hackers = await fs.readFile("data/hackerlist");
            hackers = hackers.toString().split("\n");
            ezmsgs = await fs.readFile("data/ez");
            ezmsgs = ezmsgs.toString().split("\n");
        } catch (e) {
            error = true;
            run.dbERROR = true;
            await run.save();
            logger.err("Database broken please fix me");
            await BotUtils.errHook.send("Database broken please fix me");
        }

        BotUtils.fileCache.dayacclist = dayacclist;
        BotUtils.fileCache.weeklyacclist = weeklyacclist;
        BotUtils.fileCache.monthlyacclist = monthlyacclist;
        BotUtils.fileCache.acclist = acclist;
        BotUtils.fileCache.disclist = disclist;
        BotUtils.fileCache.status = status;
        BotUtils.fileCache.updatetime = updatetime;
        BotUtils.fileCache.hackers = hackers;
        BotUtils.fileCache.ezmsgs = ezmsgs;

        if (!error && run.dbERROR) {
            run.dbERROR = false;
            await run.save();
            await BotUtils.logHook.send("Database restored");
        }
    }
};
