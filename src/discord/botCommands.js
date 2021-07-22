const config = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const Runtime = require("../Runtime");
const owner = "156952208045375488";

let linkCmd = require("./Commands/Link");
let statusCmd = require("./Commands/Status");
let timeUpdateCmd = require("./Commands/LastUpdate");
let KillBotCmd = require("./Commands/KillBot");
let MKinvCmd = require("./Commands/MakeInviteEmbed");
let MKhookCmd = require("./Commands/MakeHook");
let UpdRolesCmd = require("./Commands/UpdateRoles");
let InfoCmd = require("./Commands/Info");
let EZ = require("./Commands/EZ");
let Ping = require("./Commands/Ping");
let Echo = require("./Commands/Echo");
let Blacklist = require("./Commands/Blacklist");
let CyclePresence = require("./Commands/CyclePresence");
let Eval = require("./Commands/Eval");
let ezmsgs = require("./Commands/ezmsgs");
let Hackerlist = require("./Commands/Hackerlist");
let SetAvatar = require("./Commands/SetAvatar");
let SetPresence = require("./Commands/SetPresence");
let SetUsername = require("./Commands/SetUsername");
let Exec = require("./Commands/Exec");
let FetchUser = require("./Commands/FetchUser");
let FetchGuild = require("./Commands/FetchGuild");
let FetchChannel = require("./Commands/FetchChannel");
let TopGames = require("./Commands/TopGames");
const CommandResponse = require("./Utils/CommandResponse");
const { ERROR_DATABASE_ERROR, ERROR_USE_SLASH_COMMAND } = require("./Utils/Embeds/DynamicEmbeds");
const { ERROR_API_DOWN } = require("./Utils/Embeds/StaticEmbeds");

function requireNew(str) {
    delete require.cache[str];
    return require(str);
}

async function execute(msg, senderID) {
    if (msg.content.startsWith(config.commandCharacter)) {
        if (Runtime.fromJSON().dbERROR) {
            return { res: "", embed: ERROR_DATABASE_ERROR };
        }
        if (Runtime.fromJSON().apiDown) {
            return { res: "", embed: ERROR_API_DOWN };
        }
        let cmdArr = msg.content.slice(1).split(" ");
        let res = await checkCommands(msg, cmdArr[0], cmdArr.slice(1), senderID);
        if(res instanceof CommandResponse) {
            return res;
        } else {
            return new CommandResponse(res);
        }
    }
    return;
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
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("s", "stats") };
            break;

        case "newacc":
        case "addacc":
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("addacc", "addaccount") };
            break;

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("lb", "leaderboard") };
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
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("getdataraw", "getdataraw") };
            break;
        }

        case "players":
        case "amnts":
        case "plrs":
        case "counts":
        case "amounts":
        case "gamecounts": {
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("gamecounts", "gamecounts") };
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
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("help", "arcadehelp") };
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
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("namehistory", "namehistory") };
        }

        case "whois":
        case "whoam":
        case "whos": {
            return { res: "", embed: ERROR_USE_SLASH_COMMAND("whois", "whois") };
        }

        case "info":
        case "botinfo": {
            return await InfoCmd.execute(args, author);
        }

        case "say":
        case "echo": {
            return await Echo.execute(args, author, rawMsg);
        }

        case Blacklist.name.toLowerCase(): {
            return await Blacklist.execute(args, author, rawMsg);
        }

        case CyclePresence.name.toLowerCase(): {
            return await CyclePresence.execute(args, author, rawMsg);
        }

        case Eval.name.toLowerCase(): {
            return await Eval.execute(args, author, rawMsg);
        }

        case Exec.name.toLowerCase(): {
            return await Exec.execute(args, author, rawMsg);
        }

        case ezmsgs.name.toLowerCase(): {
            return await ezmsgs.execute(args, author, rawMsg);
        }

        case Hackerlist.name.toLowerCase(): {
            return await Hackerlist.execute(args, author, rawMsg);
        }

        case SetAvatar.name.toLowerCase(): {
            return await SetAvatar.execute(args, author, rawMsg);
        }

        case SetPresence.name.toLowerCase(): {
            return await SetPresence.execute(args, author, rawMsg);
        }

        case SetUsername.name.toLowerCase(): {
            return await SetUsername.execute(args, author, rawMsg);
        }

        case FetchUser.name.toLowerCase(): {
            return await FetchUser.execute(args, author, rawMsg);
        }

        case FetchGuild.name.toLowerCase(): {
            return await FetchGuild.execute(args, author, rawMsg);
        }

        case FetchChannel.name.toLowerCase(): {
            return await FetchChannel.execute(args, author, rawMsg);
        }

        case TopGames.name.toLowerCase(): {
            if(author == owner) {
                return await TopGames.execute(args, author, rawMsg);
            }
        }

        case "clearcache" : {
            linkCmd = requireNew("./Commands/Link");
            statusCmd = requireNew("./Commands/Status");
            timeUpdateCmd = requireNew("./Commands/LastUpdate");
            KillBotCmd = requireNew("./Commands/KillBot");
            MKinvCmd = requireNew("./Commands/MakeInviteEmbed");
            MKhookCmd = requireNew("./Commands/MakeHook");
            UpdRolesCmd = requireNew("./Commands/UpdateRoles");
            InfoCmd = requireNew("./Commands/Info");
            EZ = requireNew("./Commands/EZ");
            Ping = requireNew("./Commands/Ping");
            Echo = requireNew("./Commands/Echo");
            Blacklist = requireNew("./Commands/Blacklist");
            CyclePresence = requireNew("./Commands/CyclePresence");
            Eval = requireNew("./Commands/Eval");
            ezmsgs = requireNew("./Commands/ezmsgs");
            Hackerlist = requireNew("./Commands/Hackerlist");
            SetAvatar = requireNew("./Commands/SetAvatar");
            SetPresence = requireNew("./Commands/SetPresence");
            SetUsername = requireNew("./Commands/SetUsername");
            Exec = requireNew("./Commands/Exec");
            FetchUser = requireNew("./Commands/FetchUser");
            FetchGuild = requireNew("./Commands/FetchGuild");
            FetchChannel = requireNew("./Commands/FetchChannel");
            TopGames = requireNew("./Commands/TopGames");

            return {res : "Commands uncached!"}
        }

        default: {
            logger.warn('Nonexistent command "' + command.toLowerCase() + '" was attempted.');
            return { res: "" };
        }
    }
}

module.exports = { execute: execute };
