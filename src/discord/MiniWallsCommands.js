let linkCmd = require("./Commands/Link");
let timeUpdateCmd = require("./Commands/LastUpdate");
let InfoCmd = require("./Commands/Info");
const logger = require("hyarcade-logger");
const Runtime = require("../Runtime");
const MiniWalls = require("./Commands/MiniWalls");
const MiniWallsLB = require("./Commands/MiniWallsLB");
const MiniWallsCompare = require("./Commands/MiniWallsCompare");
const Ping = require("./Commands/Ping");
const {
    ERROR_DATABASE_ERROR
} = require("./Utils/Embeds/DynamicEmbeds");
const {
    ERROR_API_DOWN
} = require("./Utils/Embeds/StaticEmbeds");

/**
 * @param msg
 * @param senderID
 */
async function execute(msg, senderID) {
    if(msg.content.startsWith(".")) {
        if(Runtime.fromJSON().dbERROR) {
            logger.warn("Someone tried to run a command while the database is corrupted!");
            return {
                res: "",
                embed: ERROR_DATABASE_ERROR
            };
        }
        if(Runtime.fromJSON().apiDown) {
            logger.warn("Someone tried to run a command while the API is down!");
            return {
                res: "",
                embed: ERROR_API_DOWN
            };
        }
        let cmdArr = msg.content.slice(1).split(" ");
        return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    }
    return {
        res: ""
    };
}

/**
 * @param rawMsg
 * @param command
 * @param args
 * @param author
 */
async function checkCommands(rawMsg, command, args, author) {
    switch(command.toLowerCase()) {
    case "link":
    case "ln": {
        return await linkCmd.execute(args, author, rawMsg);
    }

    case "s":
    case "player":
    case "mw":
    case "stats": {
        return await MiniWalls.execute(args, author, rawMsg);
    }

    case "lb":
    case "leaderboard":
    case "mwlb":
    case "mlb":
    case "miniwallsleaderboard":
    case "miniwallslb": {
        return await MiniWallsLB.execute(args, author, rawMsg);
    }

    case "mwcompare":
    case "mwc":
    case "c":
    case "compare":
    case "comparemw": {
        return MiniWallsCompare.execute(args, author, rawMsg);
    }

    case "lastupdate":
    case "timeupdate":
    case "catlock":
    case "locktime":
    case "updatetime":
    case "checkupdate": {
        return await timeUpdateCmd.execute(args, author);
    }

    case "flb": {
        const {
            FakeLb
        } = await import("./Commands/FakeLb.mjs");
        return await FakeLb.execute(args, author, rawMsg);
    }

    case "info":
    case "botinfo": {
        return await InfoCmd.execute(args, author);
    }

    case "ping": {
        return await Ping.execute(args, author);
    }

    default: {
        logger.out("Nonexistent command \"" + command.toLowerCase() + "\" was attempted.");
        return {
            res: ""
        };
    }
    }
}

module.exports = {
    execute: execute
};
