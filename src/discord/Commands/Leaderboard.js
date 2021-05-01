const { MessageEmbed, Util } = require("discord.js");
const Command = require("../../classes/Command");
const Config = require("../../Config");
const listUtils = require("../../listUtils");

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

        default: {
            time = "Lifetime";
            res = await listUtils.stringLB(prop, limit, category);
            break;
        }
    }

    res = res != "" ? Util.escapeMarkdown(res) : "Nobody has won.";
    let embed = new MessageEmbed()
        .setTitle(time + " Leaderboard")
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
    if (args.length < 2) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0x00cc66)
            .setDescription(
                "This command requires two arguments, game and type. Use the help command for more info."
            );
        return {
            res: "",
            embed: embed,
        };
    }

    let type = args[0];
    let timetype = args[1];
    let limit = args[2] != undefined ? args[2] : 10;
    let res = "";

    switch (type) {
        case "sex":
        case "sexy":
        case "party":
        case "partygames":
        case "pg": {
            res = await getLB("wins", timetype, limit);
            break;
        }

        case "fh":
        case "hot":
        case "farm":
        case "fmhnt":
        case "farmhunt":
        case "frmhnt": {
            res = await getLB("farmhuntWins", timetype, limit);
            break;
        }

        case "fhpoop":
        case "poop":
        case "poopcollected":
        case "fmhntpoop": {
            res = await getLB("farmhuntShit", timetype, limit);
            break;
        }

        case "hs":
        case "hys":
        case "hypixel":
        case "says":
        case "hysays": {
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
            res = await getLB("footballWins", timetype, limit);
            break;
        }

        case "es":
        case "spleeg":
        case "ender":
        case "enderman":
        case "trash":
        case "enderspleef": {
            res = await getLB("enderSpleefWins", timetype, limit);
            break;
        }

        case "to":
        case "throw":
        case "toss":
        case "sumo2":
        case "throwout": {
            res = await getLB("throwOutWins", timetype, limit);
            break;
        }

        case "throwkills":
        case "tokills": {
            res = await getLB("throwOutKills", timetype, limit, "extras");
            break;
        }

        case "gw":
        case "sw":
        case "galaxy":
        case "galaxywars": {
            res = await getLB("galaxyWarsWins", timetype, limit);
            break;
        }

        case "dw":
        case "dragon":
        case "dragonWars": {
            res = await getLB("dragonWarsWins", timetype, limit);
            break;
        }

        case "bh":
        case "bnt":
        case "one":
        case "oneinthequiver":
        case "bountyhunters": {
            res = await getLB("bountyHuntersWins", timetype, limit);
            break;
        }

        case "bd":
        case "do":
        case "dayone":
        case "blocking":
        case "blockingdead": {
            res = await getLB("blockingDeadWins", timetype, limit);
            break;
        }

        case "arc":
        case "arcade":
        case "all": {
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
            res = await getLB("hideAndSeekWins", timetype, limit);
            break;
        }

        case "z":
        case "zs":
        case "zbs":
        case "zomb":
        case "zbies":
        case "zombies": {
            res = await getLB("zombiesWins", timetype, limit);
            break;
        }

        case "ctw":
        case "capkills":
        case "capture":
        case "ctwkills": {
            res = await getLB("ctwKills", timetype, limit);
            break;
        }

        case "ctwool":
        case "capwool":
        case "ctwwool":
        case "ctwwoolcaptured": {
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
            res = await getLB("pixelPaintersWins", timetype, limit);
            break;
        }

        case "coins":
        case "arccoins":
        case "arcadecoins":
        case "arcade_coins": {
            res = await getLB("arcadeCoins", timetype, limit);
            break;
        }

        case "easter":
        case "eastersim":
        case "eastersimulator":
        case "easter-simulator": {
            res = await getLB("easter", timetype, limit, "seasonalWins");
            break;
        }

        case "scuba":
        case "scubasim":
        case "scubasimulator":
        case "scuba-simulator": {
            res = await getLB("scuba", timetype, limit, "seasonalWins");
            break;
        }

        case "halloween":
        case "halloweensim":
        case "halloweensimulator":
        case "halloween-simulator": {
            res = await getLB("halloween", timetype, limit, "seasonalWins");
            break;
        }

        case "grinch":
        case "grinchsim":
        case "grinchsimulator":
        case "grinch-simulator": {
            res = await getLB("grinch", timetype, limit, "seasonalWins");
            break;
        }

        case "totalsim":
        case "totalsimulator":
        case "total-simulator": {
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

    return { res: "", embed: res };
});
