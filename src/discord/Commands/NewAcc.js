const utils = require("../../utils");
const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const { MessageEmbed } = require("discord.js");

module.exports = new Command("newAcc", ["*"], async (args, rawMsg) => {
    let category = "others";
    await BotUtils.logHook.send(`Adding accounts ${args.slice(0, -1)}`);
    let embed = new MessageEmbed()
        .setTitle("Waiting...")
        .setDescription(
            "Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!"
        )
        .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
        .setColor(0xdcde19)
        .setFooter(
            "Please avoid using this unless they should actually be in the database, too many people slows down the overall system."
        );

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });
    let res = await addAccounts(category, args.slice(0, -1));
    res = "```\n" + res + "\n```"
    let embed2 = new MessageEmbed()
        .setTitle("Accounts added")
        .setDescription(res)
        .setFooter("It will take a little while for these accounts to be fully added to the database, please be patient.")
        .setTimestamp(Date.now())
        .setColor(0x44a3e7);
    await tmpMsg.delete();
    return { res: "", embed: embed2 };
});
