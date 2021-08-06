const {
    addAccounts
} = require("../../listUtils");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const Webhooks = require("../Utils/Webhooks");
const {
    WARN_WAITING,
    ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");
const {
    INFO_ACCOUNTS_ADDED
} = require("../Utils/Embeds/DynamicEmbeds");

module.exports = new Command("newAcc", ["*"], async (args, rawMsg) => {
    logger.out("Out of database transaction occuring!");
    let category = "others";
    await Webhooks.logHook.send(`Adding accounts ${args}`);
    let embed = WARN_WAITING;
    if(args[0] == "") {
        return {
            res: "",
            embed: ERROR_IGN_UNDEFINED
        };
    }

    let tmpMsg = await rawMsg.channel.send("", {
        embed: embed
    });
    let res = await addAccounts(category, args);
    res = `\`\`\`\n${res}\n\`\`\``;
    let embed2 = INFO_ACCOUNTS_ADDED(res);
    await tmpMsg.delete();
    return {
        res: "",
        embed: embed2
    };
});
