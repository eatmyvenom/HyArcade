const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const Embeds = require("../Embeds");
const { logger } = require("../../utils");

module.exports = new Command("newAcc", ["*"], async (args, rawMsg) => {
    logger.out("Out of database transaction occuring!");
    let category = "others";
    await BotUtils.logHook.send(`Adding accounts ${args}`);
    let embed = Embeds.waiting;
    if (args[0] == "") {
        return { res: "", embed: Embeds.errIgnNull };
    }

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });
    let res = await addAccounts(category, args);
    res = "```\n" + res + "\n```";
    let embed2 = Embeds.accsAdded(res);
    await tmpMsg.delete();
    return { res: "", embed: embed2 };
});
