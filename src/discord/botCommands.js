const config = require("../Config").fromJSON();
let linkCmd = require("./Commands/Link");
let statsCommand = require("./Commands/Stats");
let newAccCmd = require("./Commands/NewAcc");
let helpCmd = require("./Commands/Help");
let pglbCmd = require("./Commands/PGLeaderboard");
let lbCmd = require("./Commands/Leaderboard");

async function execute(txt, senderID) {
    if (txt.startsWith(config.commandCharacter)) {
        let cmdArr = txt.slice(1).split(" ");
        return await checkCommands(cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

async function checkCommands(command, args, author) {
    switch (command) {
        case "link":
        case "ln":
            return await linkCmd.execute(args, author);
            break;

        case "stats":
        case "s":
            return await statsCommand.execute(args, author);
            break;

        case "newAcc":
        case "addAcc":
            return await newAccCmd.execute(args, author);
            break;

        case "pglb":
        case "pgleaderboard":
        case "partygamesleaderboard":
        case "partygameslb":
        case "partylb": {
            return await pglbCmd.execute(args, author);
            break;
        }

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            return await lbCmd.execute(args, author);
            break;
        }

        case "help": {
            return await helpCmd.execute(args, author);
            break;
        }
    }
    return { res: "" };
}

module.exports = { execute: execute };
