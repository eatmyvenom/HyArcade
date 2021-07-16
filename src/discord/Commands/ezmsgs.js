const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const { ERROR_ARGS_LENGTH } = require("../Embeds");

module.exports = new Command("ezmsgs", ["%trusted%"], async (args) => {
    /**
     * @type {String[]}
     */
    let msgs = await BotUtils.getFromDB("ezmsgs");

    let operation = args[0];
    let arg = args.slice(1).join(" ");

    if(operation == undefined) {
        return { res: "", embed : ERROR_ARGS_LENGTH(1)};
    }

    let res;
    let hasChange = false;

    switch(operation) {
        case "+":
        case "add":
        case "plus": {
            msgs.push(arg);
            res = { res : "Message added!"};
            hasChange = true;
            break;
        }

        case "-":
        case "rm":
        case "remove": {
            msgs = msgs.filter(h => h != arg);
            res = { res : "Message removed!" };
            hasChange = true;
            break;
        }

        case "-l":
        case "ls":
        case "list":
        case "show": {
            res = { res :"```\n" + msgs.join("\n") + "```"}
            break;
        }
    }

    if(hasChange) {
        await BotUtils.writeToDB("blaclist", msgs);
    }

    return res;
});
