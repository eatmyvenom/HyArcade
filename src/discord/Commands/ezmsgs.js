const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");
const {
    ERROR_ARGS_LENGTH
} = require("../Utils/Embeds/DynamicEmbeds");

module.exports = new Command("ezmsgs", ["%trusted%"], async (args) => {
    /**
     * @type {string[]}
     */
    let msgs = await BotUtils.getFromDB("ezmsgs");

    let operation = args[0];
    let arg = args.slice(1).join(" ");

    if(operation == undefined) {
        return {
            res: "",
            embed: ERROR_ARGS_LENGTH(1)
        };
    }

    let res;
    let hasChange = false;

    switch(operation) {
    case "+":
    case "add":
    case "plus": {
        msgs.push(arg);
        res = new CommandResponse("Message added!");
        hasChange = true;
        break;
    }

    case "-":
    case "rm":
    case "remove": {
        msgs = msgs.filter(h => h != arg);
        res = new CommandResponse("Message removed!");
        hasChange = true;
        break;
    }

    case "-l":
    case "ls":
    case "list":
    case "show": {
        res = new CommandResponse(`\`\`\`\n${msgs.join("\n")}\`\`\``);
        break;
    }
    }

    if(hasChange) {
        await BotUtils.writeToDB("ezmsgs", msgs);
    }

    return res;
});
