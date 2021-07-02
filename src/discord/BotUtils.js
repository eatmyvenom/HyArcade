const { MessageEmbed, WebhookClient } = require("discord.js");
const cfg = require("../Config").fromJSON();
const webhook = require("../events/webhook");
const Embed = require("./Embeds");
const AdvancedEmbeds = require("./AdvancedEmbeds");
const AccountResolver = require("./Utils/AccountResolver");
module.exports = class BotUtils {
    static fileCache = {};
    static isBotInstance = false;
    static logHook;
    static errHook;
    static client;
    static msgCopyHook;
    static botMode;

    static async resolveAccount(string, rawMessage, canbeSelf = true) {
        return await AccountResolver(
            string,
            rawMessage,
            canbeSelf,
            BotUtils.fileCache.acclist,
            BotUtils.fileCache.disclist
        );
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
            await BotUtils.fileCache.updatetime,
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

    static async logCommand(command, args, author, link) {
        await BotUtils.msgCopyHook.send({ embeds: [Embed.execution(command, args, author, link)] });
    }

    static getBlacklistRes() {
        let embed = new MessageEmbed()
            .setTitle("You are blacklisted")
            .setDescription(
                "This means you can not use the bots commands, all attempts will be ignored and you will instead be sent this message in dm's. This action will not expire over time. Should you wish to become unblacklisted then talk to EatMyVenom."
            )
            .setColor(0xff0000);

        return embed;
    }
};
