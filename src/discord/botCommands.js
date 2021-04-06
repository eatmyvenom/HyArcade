const config = require("../Config").fromJSON();
let linkCmd = require("./Commands/Link");
let statsCommand = require("./Commands/Stats");
let newAccCmd = require("./Commands/NewAcc");
let helpCmd = require("./Commands/Help");
let lbCmd = require("./Commands/Leaderboard");
let verifyCmd = require("./Commands/LinkMe");
let countCmd = require('./Commands/GameCounts');

async function execute(msg, senderID) {
    if (msg.content.startsWith(config.commandCharacter)) {
        let cmdArr = msg.content.slice(1).split(" ");
        return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

async function checkCommands(rawMsg, command, args, author) {
    switch (command.toLowerCase()) {
        case "link":
        case "ln":
            return await linkCmd.execute(args, author);
            break;

        case "lnm":
        case "verify":
        case "linkme": {
            return await verifyCmd.execute(args, author, rawMsg);
        }

        case "stats":
        case "s":
            return await statsCommand.execute(args, author, rawMsg);
            break;

        case "newAcc":
        case "addAcc":
            return await newAccCmd.execute(args, author);
            break;

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            return await lbCmd.execute(args, author);
            break;
        }

        case "players":
        case "amnts":
        case "plrs":
        case "gamecounts": {
            return await countCmd.execute(args, author);
        }

        case "help": {
            return await helpCmd.execute(args, author);
            break;
        }
    }
    return { res: "" };
}

module.exports = { execute: execute };
