const { MessageEmbed, WebhookClient } = require("discord.js");
const listUtils = require("../listUtils");
const utils = require("../utils");
const webhook = require("../webhook");

function stringify(str) {
    return "" + str;
}
let ignClient  = new WebhookClient('833970452719468544', 'MWF_fiqaP2X_iuv9QCJTWD8Rp7VTtPGpBFOpH6VgTwKM0SLMV1ndWSOK1J7pJqXlwUwG');
let logs = [
    {id : '779191444828323890' , hook : ignClient},
    {id : '742761029586649148' , hook : ignClient},
    {id : '808114257299243038' , hook : ignClient},
    {id : '810620555073814550' , hook : ignClient},
    {id : '805440398109573161' , hook : ignClient},
    {id : '815619948575457311' , hook : ignClient},
    {id : '826907021609271327' , hook : ignClient},
]

module.exports = class BotUtils {
    static logHook;
    static errHook;
    static client;
    static msgCopyHook;

    static async resolveAccount(string, rawMessage) {
        string = stringify(string);
        let acclist = await utils.readJSON("./accounts.json");
        let acc;
        if (string.length == 18) {
            acc = acclist.find((a) => a.discord == string);
        }

        if (acc == undefined && string.length > 16) {
            acc = acclist.find(
                (a) => a.uuid.toLowerCase() == string.toLowerCase()
            );
        } else if (acc == undefined && string.length <= 16) {
            acc = acclist.find(
                (a) => a.name.toLowerCase() == string.toLowerCase()
            );
        }

        if (acc == undefined) {
            let discusers = await rawMessage.guild.members.fetch({
                query: string,
                limit: 1,
            });
            if (discusers.size > 0) {
                let id = discusers.first().id;
                acc = acclist.find((a) => a.discord == id);
            }
        }

        if (acc == undefined) {
            if (rawMessage.mentions.users.size > 0) {
                let discid = "" + rawMessage.mentions.users.first();
                acc = acclist.find(
                    (a) =>
                        stringify(a.discord).toLowerCase() ==
                        discid.toLowerCase()
                );
            }
        }

        if (acc == undefined) {
            let discid = rawMessage.author.id;
            acc = acclist.find(
                (a) =>
                    stringify(a.discord).toLowerCase() == discid.toLowerCase()
            );
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
            avatarURL:
                "https://cdn.discordapp.com/avatars/818719828352696320/e3d2cac7292077850196fe232f1e7efe.webp",
            embeds: embeds,
        };
    }

    static async getPGDailyEmbed() {
        let day = await listUtils.listDiff("accounts", "day", 999);
        return webhook.generateEmbed(day);
    }

    static emptyField(inline) {
        return {
            name: "\u200B",
            value: "\u200B",
            inline: inline,
        };
    }

    static async getStats(acc, game) {
        let iconURL = "https://crafatar.com/avatars/" + acc.uuid + "?overlay";
        let thumbURL =
            "https://crafatar.com/renders/body/" + acc.uuid + "?overlay";
        let playerURL =
            "http://eatmyvenom.me/share/partygames/player.html?q=" + acc.name;

        let lvl = Math.round(acc.level * 100) / 100;

        let fields = [];

        switch (game.toLowerCase()) {
            case "party":
            case "partygames":
            case "pg": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Party games wins",
                    value: acc.wins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "fh":
            case "farm":
            case "fmhnt":
            case "farmhunt":
            case "frmhnt": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Farm hunt wins",
                    value: acc.farmhuntWins,
                    inline: true,
                });
                fields.push({
                    name: "Farm hunt poop",
                    value: acc.farmhuntShit,
                    inline: true,
                });
                break;
            }

            case "hs":
            case "hys":
            case "hypixel":
            case "says":
            case "hysays": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Hypixel says wins",
                    value: acc.hypixelSaysWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "hitw":
            case "hit":
            case "hole":
            case "pain": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "HITW wins",
                    value: acc.hitwWins,
                    inline: true,
                });
                fields.push({
                    name: "HITW qualifiers",
                    value: acc.hitwQual,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "HITW finals",
                    value: acc.hitwFinal,
                    inline: true,
                });
                fields.push({
                    name: "HITW walls",
                    value: acc.hitwRounds,
                    inline: true,
                });
                break;
            }

            case "mw":
            case "miw":
            case "mini":
            case "mwall":
            case "wall":
            case "pvp":
            case "miniwalls": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Mini walls wins",
                    value: acc.miniWallsWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "sc":
            case "fb":
            case "foot":
            case "ballin":
            case "fuck":
            case "shit":
            case "football": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Football wins",
                    value: acc.footballWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "es":
            case "spleeg":
            case "ender":
            case "enderman":
            case "trash":
            case "enderspleef": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Ender spleef wins",
                    value: acc.enderSpleefWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "to":
            case "throw":
            case "toss":
            case "sumo2":
            case "throwout": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Throw out wins",
                    value: acc.throwOutWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "gw":
            case "sw":
            case "galaxy":
            case "galaxywars": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Galaxy wars wins",
                    value: acc.galaxyWarsWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "dw":
            case "dragon":
            case "dragonwars": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Dragon wars wins",
                    value: acc.dragonWarsWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "bh":
            case "bnt":
            case "one":
            case "bounty":
            case "oneinthequiver":
            case "bountyhunters": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Bounty hunters wins",
                    value: acc.bountyHuntersWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "bd":
            case "do":
            case "dayone":
            case "blocking":
            case "blockingdead": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Blocking dead wins",
                    value: acc.blockingDeadWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "has":
            case "hide":
            case "h&s":
            case "hns":
            case "probotkeptspammingthisshit":
            case "hideandseek":
            case "hidenseek":
            case "hideseek": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Hide and seek wins",
                    value: acc.hideAndSeekWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "z":
            case "zs":
            case "zbs":
            case "zomb":
            case "zbies":
            case "zombies": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Zombies wins",
                    value: acc.zombiesWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "ctw":
            case "ctwool":
            case "capkills":
            case "capture":
            case "capwool":
            case "ctwwool":
            case "ctwwoolcaptured":
            case "ctwkills": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Ctw kills",
                    value: acc.ctwKills,
                    inline: true,
                });
                fields.push({
                    name: "Ctw wool captured",
                    value: acc.ctwWoolCaptured,
                    inline: true,
                });
                break;
            }

            case "pp":
            case "draw":
            case "pixpaint":
            case "pixelpaint":
            case "pixelpainters":
            case "drawmything":
            case "drawtheirthing":
            case "drawing": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Pixel painters wins",
                    value: acc.pixelPaintersWins,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                break;
            }

            case "sim":
            case "simulator":
            case "seasonal":
            case "season":
            case "sea": {
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Easter sim wins",
                    value: acc.seasonalWins.easter,
                    inline: true,
                });
                fields.push({
                    name: "Scuba sim wins",
                    value: acc.seasonalWins.scuba,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Holloween sim wins",
                    value: acc.seasonalWins.halloween,
                    inline: true,
                });
                fields.push({
                    name: "Grinch sim wins",
                    value: acc.seasonalWins.grinch,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
                fields.push({
                    name: "Total sim wins",
                    value: acc.seasonalWins.total,
                    inline: true,
                });
                fields.push(BotUtils.emptyField(true));
            }
        }

        fields.push(BotUtils.emptyField(true));
        let rank = ("" + acc.rank)
            .replace(/_/g, "")
            .replace(/PLUS/g, "+")
            .replace(/undefined/g, "non");
        rank = rank == "" ? "Non" : rank;

        let embed = new MessageEmbed()
            .setAuthor(acc.name, iconURL, playerURL)
            .setTitle("Stats")
            .setThumbnail(thumbURL)
            .setColor(0x44a3e7)
            .addField("All wins", acc.anyWins, true)
            .addField("Arcade wins", acc.arcadeWins, true)
            .addFields(fields)
            .addField("Level", lvl, true)
            .addField("Rank", rank, true)
            .addFields([BotUtils.emptyField(true)])
            .addField("UUID", acc.uuid, false);

        return { res: "", embed: embed };
    }

    static async logIgns(msg) {
        let channelID = msg.channel.id;

        for(let logger of logs) {
            if(channelID == logger.id) {
                await logcopy(msg, logger.hook);
            }
        }
    }

    static async logcopy(msg, hook) {
        let pfp = msg.author.avatarURL();
        let name = "unknown";
        if(msg.member) {
            name = msg.member.displayName;
        }

        await hook.send(msg.content, {username : name, avatarURL : pfp});
        await hook.send(msg.url, {username : name, avatarURL : pfp});
    }
};
