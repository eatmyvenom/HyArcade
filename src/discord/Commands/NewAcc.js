const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const Embeds = require("../Embeds");
const { logger } = require("../../utils");
const Webhooks = require("../Utils/Webhooks");

module.exports = new Command("newAcc", ["*"], async (args, rawMsg) => {
    logger.out("Out of database transaction occuring!");
    let category = "others";
    await Webhooks.logHook.send(`Adding accounts ${args}`);
    let embed = Embeds.WARN_WAITING;
    if (args[0] == "") {
        return { res: "", embed: Embeds.ERROR_IGN_UNDEFINED };
    }

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });
    let res = await addAccounts(category, args);
    res = "```\n" + res + "\n```";
    let embed2 = Embeds.INFO_ACCOUNTS_ADDED(res);
    await tmpMsg.delete();
    return { res: "", embed: embed2 };
});
