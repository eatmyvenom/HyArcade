const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const config = require("../../Config").fromJSON();
const BotUtils = require("../BotUtils");

module.exports = new Command("stats", ["*"], async (args, rawMsg) => {
    let player = args[0];

    let game = "" + args[args.length - 1];

    let acc = await BotUtils.resolveAccount(player, rawMsg);
    if (acc == undefined) {
        if (player == undefined) {
            return {
                res: `It appears your discord isn't linked, run ${config.commandCharacter}verify to link yourself.`,
            };
        }
        return { res: player + " is not in the database" };
    }

    let iconURL = "https://crafatar.com/avatars/" + acc.uuid + "?overlay";
    let thumbURL = "https://crafatar.com/renders/body/" + acc.uuid + "?overlay";
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
    }

    fields.push(BotUtils.emptyField(true));

    let embed = new MessageEmbed()
        .setAuthor(acc.name, iconURL, playerURL)
        .setTitle("Stats")
        .setThumbnail(thumbURL)
        .setColor(0x44a3e7)
        .addField("All wins", acc.anyWins, true)
        .addField("Arcade wins", acc.arcadeWins, true)
        .addFields(fields)
        .addField("Level", lvl, true)
        .addField(
            "Rank",
            ("" + acc.rank)
                .replace(/_/g, "")
                .replace(/PLUS/g, "+")
                .replace(/undefined/g, "non"),
            true
        )
        .addFields([BotUtils.emptyField(true)])
        .addField("UUID", acc.uuid, false);

    return { res: "", embed: embed };
});
