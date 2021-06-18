const config = require("../Config").fromJSON();
const embeds = require("./Embeds");

let linkCmd = require("./Commands/Link");
let timeUpdateCmd = require("./Commands/LastUpdate");
let InfoCmd = require("./Commands/Info");
const { logger } = require("../utils");
const Runtime = require("../Runtime");
const MiniWalls = require("./Commands/MiniWalls");
const MiniWallsLB = require("./Commands/MiniWallsLB");
const MiniWallsCompare = require("./Commands/MiniWallsCompare");

async function execute(msg, senderID) {
    if (msg.content.startsWith(".")) {
        if(Runtime.fromJSON().dbERROR) {
            return { res :"", embed: embeds.dbded }
        }
        if(Runtime.fromJSON().apiDown) {
            return { res :"", embed: embeds.apiDed }
        }
        let cmdArr = msg.content.slice(1).split(" ");
        return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

async function checkCommands(rawMsg, command, args, author) {
    switch (command.toLowerCase()) {
        case "link":
        case "ln": {
            return await linkCmd.execute(args, author, rawMsg);
        }

        case "s":
        case "player":
        case "mw":
        case "stats": {
            return await MiniWalls.execute(args, author, rawMsg);
            break;
        }

        case "lb":
        case "leaderboard":
        case "mwlb":
        case "mlb":
        case "miniwallsleaderboard":
        case "miniwallslb": {
            return await MiniWallsLB.execute(args,author,rawMsg);
            break;
        }

        case "mwcompare":
        case "mwc":
        case "c":
        case "compare": 
        case "comparemw": {
            return MiniWallsCompare.execute(args,author,rawMsg);
            break;
        }

        case "lastupdate":
        case "timeupdate":
        case "catlock":
        case "locktime":
        case "updatetime":
        case "checkupdate": {
            return await timeUpdateCmd.execute(args, author);
            break;
        }

        case "info":
        case "botinfo": {
            return await InfoCmd.execute(args, author);
        }

        default : {
            logger.out("Nonexistent command \"" + command.toLowerCase() + "\" was attempted.")
            return { res : "" }
        }
    }
}

module.exports = { execute: execute };
