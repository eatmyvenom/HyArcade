const { MessageEmbed, Message, Interaction, CommandInteraction } = require("discord.js");
const BotUtils = require("../BotUtils");
const Command = require("../../classes/Command");
const listUtils = require("../../listUtils");
const { logger } = require("../../utils");

async function getLB(prop, timetype, limit, category, start) {
    let res = "";
    let time;

    switch (timetype) {
        case "d":
        case "day":
        case "daily": {
            time = "Daily";
            res = await listUtils.stringLBDiff(prop, limit, "day", category, start);
            break;
        }

        case "w":
        case "week":
        case "weak":
        case "weekly": {
            time = "Weekly";
            res = await listUtils.stringLBDiff(prop, limit, "weekly", category, start);
            break;
        }

        case "m":
        case "mon":
        case "month":
        case "monthly": {
            time = "Monthly";
            res = await listUtils.stringLBDiff(prop, limit, "monthly", category, start);
            break;
        }

        case "a":
        case "all":
        case "*": {
            let day = await listUtils.stringLBDiff(prop, limit, "day", category, start);
            let week = await listUtils.stringLBDiff(prop, limit, "weekly", category, start);
            let month = await listUtils.stringLBDiff(prop, limit, "monthly", category, start);
            let life = await listUtils.stringLB(prop, limit, category, start);

            day = day == "" ? "Nobody has won" : day;
            week = week == "" ? "Nobody has won" : week;
            month = month == "" ? "Nobody has won" : month;

            let embed = new MessageEmbed()
                .setColor(0x00cc66)
                .addField("Daily", day, true)
                .addField("Weekly", week, true)
                .addField("\u200B", "\u200B", true)
                .addField("Monthly", month, true)
                .addField("Lifetime", life, true)
                .addField("\u200B", "\u200B", true);

            return embed;
            break;
        }

        default: {
            time = "Lifetime";
            res = await listUtils.stringLB(prop, limit, category, start);
            break;
        }
    }

    res = res != "" ? res : "Nobody has won.";
    let embed = new MessageEmbed().setTitle(time).setColor(0x00cc66).setDescription(res);

    if (res.length > 6000) {
        return new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0xff0000)
            .setDescription(
                "You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!"
            );
    }

    if (res.length > 2000) {
        let resArr = res.trim().split("\n");
        embed.setDescription("");
        while (resArr.length > 0) {
            let end = Math.min(25, resArr.length);
            embed.addField("\u200b", resArr.slice(0, end).join("\n"), false);
            resArr = resArr.slice(end);
        }
    }

    return embed;
}

module.exports = new Command("leaderboard", ["*"], hander);

/**
 * 
 * @param {String[]} args 
 * @param {Message} rawMsg 
 * @param {CommandInteraction} interaction 
 * @returns 
 */
async function hander(args, rawMsg, interaction) {
    let startTime = Date.now();
    if(interaction != undefined && !interaction.isButton()) {
        logger.debug("Deferring interaction");
        await interaction.defer();
    }
    if (args.length < 1) {
        let embed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor(0x00cc66)
            .setDescription("This command a game argument. Use the help command for more info.");
        return {
            res: "",
            embed: embed,
        };
    }

    let type = args[0];
    let timetype = args[1] != undefined ? args[1] : "lifetime";
    let limit = args[2] != undefined ? Number(args[2]) : 10;
    let startingIndex = args[3] != undefined ? Number(args[3]) : 0;
    let res = "";
    let gid = "";
    let gameName = "";

    switch (type.toLowerCase().trim()) {
        case "sex":
        case "sexy":
        case "party":
        case "partygames":
        case "pg": {
            gameName = "Party games";
            res = await getLB("wins", timetype, limit, undefined, startingIndex);
            gid = "pg";
            break;
        }

        case "fh":
        case "hot":
        case "farm":
        case "fmhnt":
        case "farmhunt":
        case "frmhnt": {
            gameName = "Farm hunt";
            res = await getLB("farmhuntWins", timetype, limit, undefined, startingIndex);
            gid = "fh";
            break;
        }

        case "fhp":
        case "fhpoop":
        case "poop":
        case "poopcollected":
        case "fmhntpoop": {
            gameName = "Farm hunt poop";
            res = await getLB("farmhuntShit", timetype, limit, undefined, startingIndex);
            gid = "fhp";
            break;
        }

        case "hs":
        case "hsays":
        case "hypixel_says":
        case "hypixel says":
        case "hypixelsay":
        case "hys":
        case "hypixel":
        case "says":
        case "hysays": {
            gameName = "Hypixel Says";
            res = await getLB("hypixelSaysWins", timetype, limit, undefined, startingIndex);
            gid = "hs";
            break;
        }

        case "hitw":
        case "hit":
        case "hole":
        case "holeinthewall":
        case "holewall":
        case "wallhole":
        case "wally":
        case "pain": {
            game = "Hole in the wall";
            res = await getLB("hitwWins", timetype, limit, undefined, startingIndex);
            gid = "hitw";
            break;
        }

        case "mw":
        case "miw":
        case "mini":
        case "mwall":
        case "wall":
        case "pvp":
        case "miniwalls":
        case "mwwins": {
            gameName = "Mini walls";
            res = await getLB("miniWallsWins", timetype, limit, undefined, startingIndex);
            gid = "mw";
            break;
        }

        case "mwk":
        case "mwkills": {
            gameName = "Mini Walls Kills";
            res = await getLB("kills", timetype, limit, "miniWalls", startingIndex);
            gid = "mwk";
            break;
        }

        case "mwd":
        case "mwdeaths": {
            gameName = "Mini Walls Deaths";
            res = await getLB("deaths", timetype, limit, "miniWalls", startingIndex);
            gid = "mwd";
            break;
        }

        case "mwwd":
        case "mwwitherdmg": {
            gameName = "Mini Walls Wither Damage";
            res = await getLB("witherDamage", timetype, limit, "miniWalls", startingIndex);
            gid = "mwwd";
            break;
        }

        case "mwwk":
        case "mwwitherkills": {
            gameName = "Mini Walls Wither Kills";
            res = await getLB("witherKills", timetype, limit, "miniWalls", startingIndex);
            gid = "mwwk";
            break;
        }

        case "mwf":
        case "mwfinals": {
            gameName = "Mini Walls Final Kills";
            res = await getLB("finalKills", timetype, limit, "miniWalls", startingIndex);
            gid = "mwf";
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
            res = await getLB("footballWins", timetype, limit, undefined, startingIndex);
            gid = "fb";
            break;
        }

        case "es":
        case "spleeg":
        case "ender":
        case "enderman":
        case "trash":
        case "enderspleef": {
            gameName = "Ender spleef";
            res = await getLB("enderSpleefWins", timetype, limit, undefined, startingIndex);
            gid = "es";
            break;
        }

        case "to":
        case "throw":
        case "toss":
        case "sumo2":
        case "throwout": {
            gameName = "Throw out";
            res = await getLB("throwOutWins", timetype, limit, undefined, startingIndex);
            gid = "to";
            break;
        }

        case "tok":
        case "throwkills":
        case "tokills": {
            gameName = "Throw out kills";
            res = await getLB("throwOutKills", timetype, limit, "extras", startingIndex);
            gid = "tok";
            break;
        }

        case "gw":
        case "sw":
        case "galaxy":
        case "galaxywars": {
            gameName = "Galaxy wars";
            res = await getLB("galaxyWarsWins", timetype, limit, undefined, startingIndex);
            gid = "gw";
            break;
        }

        case "dw":
        case "dragon":
        case "dragonWars": {
            gameName = "Dragon wars";
            res = await getLB("dragonWarsWins", timetype, limit, undefined, startingIndex);
            gid = "dw";
            break;
        }

        case "bh":
        case "bnt":
        case "one":
        case "oneinthequiver":
        case "bountyhunters": {
            gameName = "Bounty hunters";
            res = await getLB("bountyHuntersWins", timetype, limit, undefined, startingIndex);
            gid = "bh";
            break;
        }

        case "bd":
        case "do":
        case "dayone":
        case "walkingdead":
        case "blocking":
        case "blockingdead": {
            gameName = "Blocking dead";
            res = await getLB("blockingDeadWins", timetype, limit, undefined, startingIndex);
            gid = "bd";
            break;
        }

        case "arc":
        case "arcade":
        case "all": {
            gameName = "Arcade wins";
            res = await getLB("arcadeWins", timetype, limit, undefined, startingIndex);
            gid = "arc";
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
            res = await getLB("hideAndSeekWins", timetype, limit, undefined, startingIndex);
            gid = "hns";
            break;
        }

        case "hnsk":
        case "hnskills":
        case "haskills":
        case "hidekills":
        case "hiderkills":
        case "seekerkills":
        case "hide and seek kills": {
            gameName = "Hide and seek kills";
            res = await getLB("hnsKills", timetype, limit, undefined, startingIndex);
            gid = "hnsk";
            break;
        }

        case "z":
        case "zs":
        case "zbs":
        case "zomb":
        case "zbies":
        case "zombies": {
            gameName = "Zombies";
            res = await getLB("zombiesWins", timetype, limit, undefined, startingIndex);
            gid = "z";
            break;
        }

        case "ctw":
        case "capkills":
        case "capture":
        case "ctwkills": {
            gameName = "Capture the wool kills";
            res = await getLB("ctwKills", timetype, limit, undefined, startingIndex);
            gid = "ctw";
            break;
        }

        case "ctww":
        case "ctwool":
        case "capwool":
        case "ctwwool":
        case "ctwwoolcaptured": {
            gameName = "Capture the wool captures";
            res = await getLB("ctwWoolCaptured", timetype, limit, undefined, startingIndex);
            gid = "ctww";
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
            res = await getLB("pixelPaintersWins", timetype, limit, undefined, startingIndex);
            gid = "pp";
            break;
        }

        case "c":
        case "coins":
        case "arccoins":
        case "arcadecoins":
        case "arcade_coins": {
            gameName = "Arcade coins";
            res = await getLB("arcadeCoins", timetype, limit, undefined, startingIndex);
            gid = "c";
            break;
        }

        case "esim":
        case "easter":
        case "eastersim":
        case "eastersimulator":
        case "easter-simulator": {
            gameName = "Easter simulator";
            res = await getLB("easter", timetype, limit, "seasonalWins", startingIndex);
            gid = "esim";
            break;
        }

        case "ssim":
        case "scuba":
        case "scubasim":
        case "scubasimulator":
        case "scuba-simulator": {
            gameName = "Scuba simulator";
            res = await getLB("scuba", timetype, limit, "seasonalWins", startingIndex);
            gid = "ssim";
            break;
        }

        case "hsim":
        case "halloween":
        case "halloweensim":
        case "halloweensimulator":
        case "halloween-simulator": {
            gameName = "Halloween simulator";
            res = await getLB("halloween", timetype, limit, "seasonalWins", startingIndex);
            gid = "hsim";
            break;
        }

        case "gsim":
        case "grinch":
        case "grinchsim":
        case "grinchsimulator":
        case "grinch-simulator": {
            gameName = "Grinch simulator";
            res = await getLB("grinch", timetype, limit, "seasonalWins", startingIndex);
            gid = "gsim";
            break;
        }

        case "tsim":
        case "totalsim":
        case "totalsimulator":
        case "total-simulator": {
            gameName = "Total simulator";
            res = await getLB("total", timetype, limit, "seasonalWins", startingIndex);
            gid = "tsim";
            break;
        }

        default: {
            let embed = new MessageEmbed()
                .setTitle("ERROR")
                .setDescription(
                    `Sorry that category does not exist, use the command \`/arcadehelp games\` to see what is available.`
                )
                .setColor(0xff0000);
            return { res: "", embed: embed };
            break;
        }
    }

    let finalRes = res
        .setAuthor(gameName + " leaderboard", BotUtils.client.user.avatarURL())

    logger.out("Leaderboard command ran in " + (Date.now() - startTime) + "ms");

    let response = { res: "", embed: finalRes, game: gid, start: startingIndex };
    if (interaction == undefined) {
        response.res =
            "**WARNING** This command will be disabled 2 weeks after hypixel was brought back up. Please use `/leaderboard` instead!";
    }
    return response;
}
