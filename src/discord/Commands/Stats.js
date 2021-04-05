const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");

module.exports = new Command("stats", ["*"], async (args) => {
    let player = args[0];

    let acclist = await utils.readJSON("./accounts.json");
    let acc = acclist.find((a) => a.name.toLowerCase() == player.toLowerCase());
    if (acc == undefined) {
        return { res: player + " is not in the database" };
    }

    let iconURL = "https://crafatar.com/avatars/" + acc.uuid + "?overlay";
    let thumbURL = "https://crafatar.com/renders/body/" + acc.uuid + "?overlay";
    let playerURL =
        "http://eatmyvenom.me/share/partygames/player.html?q=" + acc.name;

    let lvl = Math.round(acc.level * 100) / 100;

    let fields = [];
    switch (("" + args[1]).toLowerCase()) {
        case "party":
        case "partygames":
        case "pg": {
            fields.push({
                name: "Party games wins",
                value: acc.wins,
                inline: false,
            });
            break;
        }

        case "fh":
        case "farm":
        case "fmhnt":
        case "farmhunt":
        case "frmhnt": {
            fields.push({
                name: "Farm hunt wins",
                value: acc.farmhuntWins,
                inline: false,
            });
            break;
        }

        case "hs":
        case "hys":
        case "hypixel":
        case "says":
        case "hysays": {
            fields.push({
                name: "Hypixel says wins",
                value: acc.hypixelSaysWins,
                inline: false,
            });
            break;
        }

        case "hitw":
        case "hit":
        case "hole":
        case "pain": {
            fields.push({
                name: "HITW wins",
                value: acc.hitwWins,
                inline: false,
            });
            fields.push({
                name: "HITW qualifiers",
                value: acc.hitwQual,
                inline: false,
            });
            fields.push({
                name: "HITW finals",
                value: acc.hitwFinal,
                inline: false,
            });
            fields.push({
                name: "HITW walls",
                value: acc.hitwRounds,
                inline: false,
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
            fields.push({
                name: "Mini walls wins",
                value: acc.miniWallsWins,
                inline: false,
            });
            break;
        }

        case "sc":
        case "fb":
        case "foot":
        case "ballin":
        case "fuck":
        case "shit":
        case "football": {
            fields.push({
                name: "Football wins",
                value: acc.footballWins,
                inline: false,
            });
            break;
        }

        case "es":
        case "spleeg":
        case "ender":
        case "enderman":
        case "trash":
        case "enderspleef": {
            fields.push({
                name: "Ender spleef wins",
                value: acc.enderSpleefWins,
                inline: false,
            });
            break;
        }

        case "to":
        case "throw":
        case "toss":
        case "sumo2":
        case "throwout": {
            fields.push({
                name: "Throw out wins",
                value: acc.throwOutWins,
                inline: false,
            });
            break;
        }

        case "gw":
        case "sw":
        case "galaxy":
        case "galaxywars": {
            fields.push({
                name: "Galaxy wars wins",
                value: acc.galaxyWarsWins,
                inline: false,
            });
            break;
        }

        case "dw":
        case "dragon":
        case "dragonWars": {
            fields.push({
                name: "Dragon wars wins",
                value: acc.dragonWarsWins,
                inline: false,
            });
            break;
        }

        case "bh":
        case "bnt":
        case "one":
        case "oneinthequiver":
        case "bountyhunters": {
            fields.push({
                name: "Bounty hunters wins",
                value: acc.bountyHuntersWins,
                inline: false,
            });
            break;
        }

        case "bd":
        case "do":
        case "dayone":
        case "blocking":
        case "blockingdead": {
            fields.push({
                name: "Blocking dead wins",
                value: acc.blockingDeadWins,
                inline: false,
            });
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
            fields.push({
                name: "Hide and seek wins",
                value: acc.hideAndSeekWins,
                inline: false,
            });
            break;
        }

        case "z":
        case "zs":
        case "zbs":
        case "zomb":
        case "zbies":
        case "zombies": {
            fields.push({
                name: "Zombies wins",
                value: acc.zombiesWins,
                inline: false,
            });
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
            fields.push({
                name: "Ctw kills",
                value: acc.ctwKills,
                inline: false,
            });
            fields.push({
                name: "Ctw wool captured",
                value: acc.ctwWoolCaptured,
                inline: false,
            });
            break;
        }

        case "pp":
        case "draw":
        case "pixpaint":
        case "pixelpaint":
        case "drawmything":
        case "drawtheirthing":
        case "drawing": {
            fields.push({
                name: "Pixel painters wins",
                value: acc.pixelPaintersWins,
                inline: false
            });
            break;
        }
    }

    let embed = new MessageEmbed()
        .setAuthor(acc.name, iconURL, playerURL)
        .setTitle("Stats")
        .setThumbnail(thumbURL)
        .setColor(0x44a3e7)
        .addField("All wins", acc.anyWins, false)
        .addField("Arcade wins", acc.arcadeWins, false)
        .addFields(fields)
        .addField("Level", lvl)
        .addField(
            "Rank",
            acc.rank.replace(/_/g, "").replace(/PLUS/g, "+"),
            false
        )
        .addField("UUID", acc.uuid, false);

    return { res: "", embed: embed };
});
