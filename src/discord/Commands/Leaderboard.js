const { MessageEmbed, Util } = require("discord.js");
const BotUtils = require("../BotUtils");
const Command = require("../../classes/Command");
const Config = require("../../Config");
const listUtils = require("../../listUtils");
const utils = require("../../utils");
const fs = require('fs/promises')

async function getLB(prop, timetype, limit, category) {
    let res = "";
    let time;

    switch (timetype) {
        case "d":
        case "day":
        case "daily": {
            time = "Daily";
            res = await listUtils.stringLBDiff(prop, limit, "day", category);
            break;
        }

        case "w":
        case "week":
        case "weak":
        case "weekly": {
            time = "Weekly";
            res = await listUtils.stringLBDiff(prop, limit, "weekly", category);
            break;
        }

        case "m":
        case "mon":
        case "month":
        case "monthly": {
            time = "Monthly";
            res = await listUtils.stringLBDiff(
                prop,
                limit,
                "monthly",
                category
            );
            break;
        }

        case "a":
        case "all":
        case "*": {
            let day = await listUtils.stringLBDiff(prop, limit, "day", category);
            let week = await listUtils.stringLBDiff(prop, limit, "weekly", category);
            let month = await listUtils.stringLBDiff(prop, limit, "monthly", category);
            let life = await listUtils.stringLB(prop, limit, category);

            day = (day == "") ? "Nobody has won" : day;
            week = (week == "") ? "Nobody has won" : week;
            month = (month == "") ? "Nobody has won" : month;


            let embed = new MessageEmbed()
                .setColor(0x00cc66)
                .addField("Daily", day, true)
                .addField("Weekly", week, true)
                .addField("\u200B", "\u200B", true)
                .addField("Monthly", month, true)
                .addField("Lifetime", life, true)
                .addField("\u200B", "\u200B", true)

            return embed;
            break;
        }

        default: {
            time = "Lifetime";
            res = await listUtils.stringLB(prop, limit, category);
            break;
        }
    }

    res = res != "" ? res : "Nobody has won.";
    let embed = new MessageEmbed()
        .setTitle(time)
        .setColor(0x00cc66)
        .setDescription(res);

    if (res.length > 2000) {
        embed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0xff0000)
            .setDescription(
                "That is too many people, please try to get a lower amount"
            );
    }

    return embed;
}

module.exports = new Command("leaderboard", ["*"], async (args) => {
    if (args.length < 1) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0x00cc66)
            .setDescription(
                "This command a game argument. Use the help command for more info."
            );
        return {
            res: "",
            embed: embed,
        };
    }

    let type = args[0];
    let timetype = args[1] != undefined ? args[1] : "lifetime";
    let limit = args[2] != undefined ? args[2] : 10;
    let res = "";
    let gameName = "";

    switch (type.toLowerCase()) {
        case "sex":
        case "sexy":
        case "party":
        case "partygames":
        case "pg": {
            gameName = "Party games";
            res = await getLB("wins", timetype, limit);
            break;
        }

        case "fh":
        case "hot":
        case "farm":
        case "fmhnt":
        case "farmhunt":
        case "frmhnt": {
            gameName = "Farm hunt";
            res = await getLB("farmhuntWins", timetype, limit);
            break;
        }

        case "fhpoop":
        case "poop":
        case "poopcollected":
        case "fmhntpoop": {
            gameName = "Farm hunt poop";
            res = await getLB("farmhuntShit", timetype, limit);
            break;
        }

        case "hs":
        case "hys":
        case "hypixel":
        case "says":
        case "hysays": {
            gameName = "Hypixel Says";
            res = await getLB("hypixelSaysWins", timetype, limit);
            break;
        }

        case "hitw":
        case "hit":
        case "hole":
        case "pain": {
            res = await getLB("hitwWins", timetype, limit);
            break;
        }

        case "mw":
        case "miw":
        case "mini":
        case "mwall":
        case "wall":
        case "pvp":
        case "miniwalls": {
            gameName = "Mini walls";
            res = await getLB("miniWallsWins", timetype, limit);
            break;
        }

        case "sc":
        case "fb":
        case "foot":
        case "ballin":
        case "fuck":
        case "shit":
        case "football": {
            gameName = "Football";
            res = await getLB("footballWins", timetype, limit);
            break;
        }

        case "es":
        case "spleeg":
        case "ender":
        case "enderman":
        case "trash":
        case "enderspleef": {
            gameName = "Ender spleef";
            res = await getLB("enderSpleefWins", timetype, limit);
            break;
        }

        case "to":
        case "throw":
        case "toss":
        case "sumo2":
        case "throwout": {
            gameName = "Throw out";
            res = await getLB("throwOutWins", timetype, limit);
            break;
        }

        case "throwkills":
        case "tokills": {
            gameName = "Throw out kills";
            res = await getLB("throwOutKills", timetype, limit, "extras");
            break;
        }

        case "gw":
        case "sw":
        case "galaxy":
        case "galaxywars": {
            gameName = "Galaxy wars";
            res = await getLB("galaxyWarsWins", timetype, limit);
            break;
        }

        case "dw":
        case "dragon":
        case "dragonWars": {
            gameName = "Dragon wars";
            res = await getLB("dragonWarsWins", timetype, limit);
            break;
        }

        case "bh":
        case "bnt":
        case "one":
        case "oneinthequiver":
        case "bountyhunters": {
            gameName = "Bounty hunters";
            res = await getLB("bountyHuntersWins", timetype, limit);
            break;
        }

        case "bd":
        case "do":
        case "dayone":
        case "blocking":
        case "blockingdead": {
            gameName = "Blocking dead";
            res = await getLB("blockingDeadWins", timetype, limit);
            break;
        }

        case "arc":
        case "arcade":
        case "all": {
            gameName = "Arcade wins";
            res = await getLB("arcadeWins", timetype, limit);
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
            gameName = "Hide and seek";
            res = await getLB("hideAndSeekWins", timetype, limit);
            break;
        }

        case "z":
        case "zs":
        case "zbs":
        case "zomb":
        case "zbies":
        case "zombies": {
            gameName = "Zombies"
            res = await getLB("zombiesWins", timetype, limit);
            break;
        }

        case "ctw":
        case "capkills":
        case "capture":
        case "ctwkills": {
            gameName = "Captrue the wool kills";
            res = await getLB("ctwKills", timetype, limit);
            break;
        }

        case "ctwool":
        case "capwool":
        case "ctwwool":
        case "ctwwoolcaptured": {
            gameName = "Capture the wool captures";
            res = await getLB("ctwWoolCaptured", timetype, limit);
            break;
        }

        case "pp":
        case "draw":
        case "pixpaint":
        case "pixelpaint":
        case "drawmything":
        case "drawtheirthing":
        case "drawing": {
            gameName = "Pixel painters";
            res = await getLB("pixelPaintersWins", timetype, limit);
            break;
        }

        case "coins":
        case "arccoins":
        case "arcadecoins":
        case "arcade_coins": {
            gameName = "Arcade coins";
            res = await getLB("arcadeCoins", timetype, limit);
            break;
        }

        case "easter":
        case "eastersim":
        case "eastersimulator":
        case "easter-simulator": {
            gameName = "Easter simulator";
            res = await getLB("easter", timetype, limit, "seasonalWins");
            break;
        }

        case "scuba":
        case "scubasim":
        case "scubasimulator":
        case "scuba-simulator": {
            gameName = "Scuba simulator";
            res = await getLB("scuba", timetype, limit, "seasonalWins");
            break;
        }

        case "halloween":
        case "halloweensim":
        case "halloweensimulator":
        case "halloween-simulator": {
            gameName = "Halloween simulator";
            res = await getLB("halloween", timetype, limit, "seasonalWins");
            break;
        }

        case "grinch":
        case "grinchsim":
        case "grinchsimulator":
        case "grinch-simulator": {
            gameName = "Grinch simulator";
            res = await getLB("grinch", timetype, limit, "seasonalWins");
            break;
        }

        case "totalsim":
        case "totalsimulator":
        case "total-simulator": {
            gameName = "Total simulator";
            res = await getLB("total", timetype, limit, "seasonalWins");
            break;
        }

        default: {
            let embed = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription(
                    `Sorry that category does not exist, use the command \`${
                        Config.fromJSON().commandCharacter
                    }help games\` to see what is available.`
                )
                .setColor(0xff0000);
            return { res: "", embed: embed };
            break;
        }
    }

    let updatetime;
    if (utils.fileExists("timeupdate")) {
        updatetime = await fs.readFile("timeupdate");
    } else {
        updatetime = "Right now!";
    }
    let date = new Date(updatetime.toString())

    let finalRes = res
        .setAuthor(gameName + " leaderboard", BotUtils.client.user.avatarURL())
        .setFooter("Data generated at", BotUtils.client.user.avatarURL())
        .setTimestamp(date);

    return { res: "", embed: finalRes };
});
