const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const Embeds = require("../Embeds");
const { MessageEmbed } = require("discord.js");

module.exports = new Command("newAcc", ["*"], async (args, rawMsg) => {
    let category = "others";
    await BotUtils.logHook.send(`Adding accounts ${args}`);
    let embed = Embeds.waiting;

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });
    let res = await addAccounts(category, args);
    res = "```\n" + res + "\n```";
    let embed2 = Embeds.accsAdded;
    await tmpMsg.delete();
    return { res: "", embed: embed2 };
});
