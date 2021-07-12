const config = require("../Config").fromJSON();
const embeds = require("./Embeds");

let linkCmd = require("./Commands/Link");
let pgdCmd = require("./Commands/PGDaily");
let statusCmd = require("./Commands/Status");
let timeUpdateCmd = require("./Commands/LastUpdate");
let KillBotCmd = require("./Commands/KillBot");
let MKinvCmd = require("./Commands/MakeInviteEmbed");
let MKhookCmd = require("./Commands/MakeHook");
let UpdRolesCmd = require("./Commands/UpdateRoles");
let InfoCmd = require("./Commands/Info");
const { logger } = require("../utils");
const Runtime = require("../Runtime");
const EZ = require("./Commands/EZ");
const Ping = require("./Commands/Ping");

async function execute(msg, senderID) {
    if (msg.content.startsWith(config.commandCharacter)) {
        if (Runtime.fromJSON().dbERROR) {
            return { res: "", embed: embeds.ERROR_DATABASE_ERROR };
        }
        if (Runtime.fromJSON().apiDown) {
            return { res: "", embed: embeds.ERROR_API_DOWN };
        }
        let cmdArr = msg.content.slice(1).split(" ");
        return await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
    }
    return { res: "" };
}

async function checkCommands(rawMsg, command, args, author) {
    logger.debug(`Parsing command ${rawMsg.content}`);
    switch (command.toLowerCase()) {
        case "link":
        case "ln":
            return await linkCmd.execute(args, author, rawMsg);
            break;

        case "lnm":
        case "verify":
        case "linkme": {
            const { Verify } = await import("./Commands/LinkMe.mjs");
            return await Verify.execute(args, author, rawMsg);
        }

        case "stats":
        case "s":
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("s", "stats") };
            break;

        case "newacc":
        case "addacc":
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("addacc", "addaccount") };
            break;

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("lb", "leaderboard") };
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
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("getdataraw", "getdataraw") };
            break;
        }

        case "players":
        case "amnts":
        case "plrs":
        case "counts":
        case "amounts":
        case "gamecounts": {
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("gamecounts", "gamecounts") };
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
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("help", "arcadehelp") };
            break;
        }

        case "mkinv": {
            return await MKinvCmd.execute(args, author);
            break;
        }

        case "mkhook": {
            return await MKhookCmd.execute(args, author);
        }

        case "ping": {
            return await Ping.execute(args, author);
        }

        case "ez": {
            return await EZ.execute(args, author);
        }

        case "updroles": {
            return await UpdRolesCmd.execute(args, author);
        }

        case "names":
        case "namehist":
        case "namehistory": {
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("namehistory", "namehistory") };
        }

        case "whois":
        case "whoam":
        case "whos": {
            return { res: "", embed: embeds.ERROR_USE_SLASH_COMMAND("whois", "whois") };
        }

        case "info":
        case "botinfo": {
            return await InfoCmd.execute(args, author);
        }

        default: {
            logger.warn('Nonexistent command "' + command.toLowerCase() + '" was attempted.');
            return { res: "" };
        }
    }
}

module.exports = { execute: execute };
