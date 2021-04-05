const Command = require("../../classes/Command");
const listUtils = require("../../listUtils");

async function getLB(prop,timetype,limit) {
    let res = "";
    if(timetype == 'd' || timetype == 'day' || timetype == "daily") {
        res = await listUtils.stringLBDaily(prop,limit);
    } else {
        res = await listUtils.stringLB(prop,limit);
    }

    return (res != "") ? "```" + res + "```" : "Nobody has won."
}

module.exports = new Command("leaderboard", ["*"], async (args)=>{
    if (args.length < 2) {
        return { res : "Use the command but correctly :slight_smile:\nUse the help command if you are unsure of how to brain!" }
    }

    let type = args[0];
    let timetype = args[1];
    let limit = (args[2] != undefined) ? args[2] : 10;
    let res = "";

    switch (type) {
        case "sex":
        case "sexy":
        case "party":
        case "partygames":
        case "pg": {
            res = await getLB('wins', timetype, limit);
            break;
        }

        case "fh":
        case "hot":
        case "farm":
        case "fmhnt":
        case "farmhunt":
        case "frmhnt": {
            res = await getLB('farmhuntWins', timetype, limit);
            break;
        }

        case "hs":
        case "hys":
        case "hypixel":
        case "says":
        case "hysays": {
            res = await getLB('hypixelSaysWins', timetype, limit);
            break;
        }

        case "hitw":
        case "hit":
        case "hole":
        case "pain": {
            res = await getLB('hitwWins', timetype, limit);
            break;
        }

        case "mw":
        case "mini":
        case "mwall":
        case "wall":
        case "pvp":
        case "miniwalls": {
            res = await getLB('miniWallsWins', timetype, limit);
            break;
        }

        case "sc":
        case "fb":
        case "foot":
        case "ballin":
        case "fuck":
        case "shit":
        case "football": {
            res = await getLB('footballWins', timetype, limit);
            break;
        }

        case "es":
        case "spleeg":
        case "ender":
        case "enderman":
        case "trash":
        case "enderspleef": {
            res = await getLB('enderSpleefWins', timetype, limit);
            break;
        }

        case "to":
        case "throw":
        case "toss":
        case "sumo2":
        case "throwout": {
            res = await getLB('throwOutWins', timetype, limit);
            break;
        }

        case "gw":
        case "sw":
        case "galaxy":
        case "galaxywars": {
            res = await getLB('galaxyWarsWins', timetype, limit);
            break;
        }

        case "dw":
        case "dragon":
        case "dragonWars": {
            res = await getLB('dragonWarsWins', timetype, limit);
            break;
        }

        case "bh":
        case "bnt":
        case "one":
        case "oneinthequiver":
        case "bountyhunters": {
            res = await getLB('bountyHuntersWins', timetype, limit);
            break;
        }

        case "bd":
        case "do":
        case "dayone":
        case "blocking":
        case "blockingdead": {
            res = await getLB('blockingDeadWins', timetype, limit);
            break;
        }

        case "arc":
        case "arcade":
        case "all": {
            res = await getLB('arcadeWins', timetype, limit);
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
        case "ctwwoolcaptured":{
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

        default: {
            res = "That category does not exist!"
            break;
        }
    }

    return { res : res}

});