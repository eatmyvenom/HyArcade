const config = require("../Config").fromJSON();
const embeds = require("./Embeds");

let linkCmd = require("./Commands/Link");
let statsCommand = require("./Commands/Stats");
let newAccCmd = require("./Commands/NewAcc");
let helpCmd = require("./Commands/Help");
let lbCmd = require("./Commands/Leaderboard");
let verifyCmd = require("./Commands/LinkMe");
let countCmd = require("./Commands/GameCounts");
let pgdCmd = require("./Commands/PGDaily");
let statusCmd = require("./Commands/Status");
let ustatsCmd = require("./Commands/UnlinkedStats");
let timeUpdateCmd = require("./Commands/LastUpdate");
let KillBotCmd = require("./Commands/KillBot");
let MKinvCmd = require("./Commands/MakeInviteEmbed");
let MKhookCmd = require("./Commands/MakeHook");
let UpdRolesCmd = require("./Commands/UpdateRoles");
let InfoCmd = require("./Commands/Info");
const { logger } = require("../utils");
const Runtime = require("../Runtime");

async function execute(msg, senderID) {
    if (msg.content.startsWith(config.commandCharacter)) {
        if(Runtime.fromJSON().dbERROR || Runtime.fromJSON().apiDown) {
            return { res :"", embed: embeds.dbded }
        }
        let cmdArr = msg.content.slice(1).split(" ");
        return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

async function checkCommands(rawMsg, command, args, author) {
    switch (command.toLowerCase()) {
        case "link":
        case "ln":
            return await linkCmd.execute(args, author, rawMsg);
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

        case "ustats":
        case "unlinkedstats":
        case "us":
            return await ustatsCmd.execute(args, author, rawMsg);
            break;

        case "newacc":
        case "addacc":
            return await newAccCmd.execute(args, author, rawMsg);
            break;

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            return await lbCmd.execute(args, author);
            break;
        }

        case "pgd":
        case "partyday":
        case "pgday":
        case "partygamesdaily":
        case "partygamesday":
        case "partygd": {
            return await pgdCmd.execute(args, author);
            break;
        }

        case "sts":
        case "status": {
            return await statusCmd.execute(args, author, rawMsg);
            break;
        }

        case "quit":
        case "stopbot":
        case "killbot":
        case "botstop": {
            return await KillBotCmd.execute(args, author);
            break;
        }

        case "getraw":
        case "getacc":
        case "getdata":
        case "rawdata":
        case "dataraw": {
            return { res : "", embed : embeds.useSlash("getdataraw", "getdataraw") };
            break;
        }

        case "players":
        case "amnts":
        case "plrs":
        case "counts":
        case "amounts":
        case "gamecounts": {
            return { res : "", embed : embeds.useSlash("gamecounts", "gamecounts") };
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

        case "help": {
            return { res : "", embed : embeds.useSlash("help", "arcadehelp") };
            break;
        }

        case "mkinv": {
            return await MKinvCmd.execute(args, author);
            break;
        }

        case "mkhook": {
            return await MKhookCmd.execute(args, author);
        }

        case "updroles": {
            return await UpdRolesCmd.execute(args, author);
        }

        case "names":
        case "namehist":
        case "namehistory": {
            return { res : "", embed : embeds.useSlash("namehistory", "namehistory") };
        }

        case "whois":
        case "whoam":
        case "whos": {
            return { res : "", embed : embeds.useSlash("whois", "whois") };
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
