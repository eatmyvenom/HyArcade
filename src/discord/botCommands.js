const config = require("../Config").fromJSON();
let linkCmd = require("./Commands/Link");
let statsCommand = require("./Commands/Stats");
let newAccCmd = require("./Commands/NewAcc");
let helpCmd = require('./Commands/Help');

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

        case "help":
            return await helpCmd.execute(args,author);
    }
    return { res: "" };
}

module.exports = { execute: execute };
