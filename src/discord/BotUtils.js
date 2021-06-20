const { MessageEmbed, WebhookClient } = require("discord.js");
const cfg = require("../Config").fromJSON();
const fs = require("fs/promises");
const { logger } = require("../utils");
const utils = require("../utils");
const webhook = require("../webhook");
const mojangRequest = require("../mojangRequest");
const Account = require("../account");
const Embed = require("./Embeds");
const AdvancedEmbeds = require("./AdvancedEmbeds");

function stringify(str) {
    return "" + str;
}

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}
module.exports = class BotUtils {
    static fileCache = {};
    static isBotInstance = false;
    static logHook;
    static errHook;
    static client;
    static msgCopyHook;
    static botMode;

    static async resolveAccount(string, rawMessage, canbeSelf = true) {
        logger.out("Attempting to resolve " + string + " from " + rawMessage.content);
        string = stringify(string).toLowerCase();
        let acclist = await BotUtils.fileCache.acclist;
        let disclist = await BotUtils.fileCache.disclist;
        let acc;
        if (string.length == 18) {
            acc = acclist.find((a) => a.discord == string);
        }

        if (acc == undefined && string.length > 16) {
            acc = acclist.find((a) => a.uuid.toLowerCase() == string);
        } else if (acc == undefined && string.length <= 16) {
            acc = acclist.find((a) => a.name.toLowerCase() == string);
        }

        if (string.length > 0 && acc == undefined) {
            let discusers = await rawMessage.guild.members.fetch({
                query: string,
                limit: 1,
            });
            if (discusers.size > 0) {
                let usr = await discusers.first();
                let id = usr.id;
                let uuid = disclist[id];
                if (uuid != undefined) {
                    acc = acclist.find((a) => a.uuid == uuid);
                }
            }
        }

        if (acc == undefined) {
            if (rawMessage.mentions.users.size > 0) {
                let discid = "" + rawMessage.mentions.users.first();
                let uuid = disclist[discid];
                if (uuid != undefined) {
                    acc = acclist.find((a) => stringify(a.uuid).toLowerCase() == uuid.toLowerCase());
                }
            }
        }

        if (acc == undefined && canbeSelf) {
            let discid = rawMessage.author.id;
            let uuid = disclist[discid];
            if (uuid != undefined) {
                acc = acclist.find((a) => stringify(a.uuid).toLowerCase() == uuid.toLowerCase());
            }
        }

        if (acc) {
            logger.out("resolved as " + acc.name);
        } else {
            logger.out("Unable to resolve, getting by ign from hypixel.");

            let plr = string;
            let uuid;
            if (plr.length > 17) {
                uuid = plr;
            } else {
                uuid = await mojangRequest.getUUID(plr);
            }

            acc = new Account("", 0, "" + uuid);
            await acc.updateData();
        }
        return acc;
    }

    static getWebhookObj(embed) {
        let embeds;
        if (embed == undefined) {
            embeds = [];
        } else {
            embeds = [embed];
        }
        return {
            username: "Arcade Bot",
            avatarURL: BotUtils.client.user.avatarURL(),
            embeds: embeds,
        };
    }

    static async getPGDailyEmbed() {
        return await webhook.genPGEmbed();
    }

    static async getStats(acc, game) {
        return await AdvancedEmbeds.getStats(
            acc,
            game,
            await BotUtils.fileCache.updatetime,
            BotUtils.client.user.avatarURL()
        );
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
