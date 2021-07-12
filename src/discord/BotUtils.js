const { MessageEmbed, WebhookClient, Client } = require("discord.js");
const cfg = require("../Config").fromJSON();
const webhook = require("../events/webhook");
const Embed = require("./Embeds");
const AdvancedEmbeds = require("./AdvancedEmbeds");
const AccountResolver = require("./Utils/AccountResolver");
const fetch = require("node-fetch");
const Logger = require("../utils/Logger");
const { logger } = require("../utils");
module.exports = class BotUtils {
    static isBotInstance = false;
    static logHook;
    static errHook;

    /**
     * @type {Client}
     */
    static client;
    static msgCopyHook;
    static botMode;
    static tus = [];

    static get trustedUsers() {
        return BotUtils.tus;
    }

    static async resolveAccount(string, rawMessage, canbeSelf = true) {
        return await AccountResolver(
            string,
            rawMessage,
            canbeSelf,
            await this.getFromDB("accounts"),
            await this.getFromDB("disclist")
        );
    }

    static async getFromDB(file) {
        let fileData;
        let url = new URL("db", "http://localhost:6000");
        let path = `${file}`;
        url.searchParams.set("path", path);
        Logger.debug(`Fetching ${url.searchParams.toString()} from database`);
    
        try {
            fileData = await (await fetch(url)).json();
        } catch(e) {
            logger.err("Can't connect to database");
            logger.err(e);
            return {};
        }
        return fileData;
    }

    static getWebhookObj(embed) {
        let embeds;
        if (embed == undefined) {
            embeds = [];
        } else {
            embeds = [embed];
        }
        return {
            username: BotUtils.client.user.username,
            avatarURL: BotUtils.client.user.avatarURL(),
            embeds: embeds,
        };
    }

    static async getPGDailyEmbed() {
        return await webhook.genPGEmbed();
    }

    static async getStats(acc, game) {
        /**
         * @type {MessageEmbed}
         */
        let embed = await AdvancedEmbeds.getStats(
            acc,
            game,
            BotUtils.client.user.avatarURL(),
            BotUtils.botMode
        );
        return embed;
    }

    static async logIgns(msg) {
        let ignClient = new WebhookClient(cfg.loggingHooks.ignHook.id, cfg.loggingHooks.ignHook.token);
        let logs = [];
        for (let c of cfg.discord.listenChannels) {
            logs.push({ id: c, hook: ignClient });
        }
        let channelID = msg.channel.id;

        for (let logger of logs) {
            if (channelID == logger.id) {
                await BotUtils.logcopy(msg, logger.hook);
            }
        }
        ignClient.destroy();
    }

    static async logcopy(msg, hook) {
        let pfp = msg.author.avatarURL();
        let name = "unknown";
        if (msg.member) {
            name = msg.member.displayName;
        }

        await hook.send({ content: msg.content, username: name, avatarURL: pfp });
        await hook.send({ content: msg.url, username: name, avatarURL: pfp });
    }

    static async logCommand(command, args, message) {
        await BotUtils.msgCopyHook.send({ embeds: [Embed.LOG_COMMAND_EXECUTION(command, args, message)] });
    }
};
