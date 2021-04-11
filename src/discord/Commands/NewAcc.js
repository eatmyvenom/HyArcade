const utils = require("../../utils");
const { addAccounts } = require("../../listUtils");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

module.exports = new Command("newAcc", utils.defaultAllowed, async (args) => {
    let category = args[args.length - 1];
    await BotUtils.logHook.send(`Adding accounts ${args.slice(0, -1)}`);
    let embed = new MessageEmbed()
        .setTitle("Waiting...")
        .setDescription(
            "Since the user is not in the database it will take some time to gather the stats. Please wait!"
        )
        .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
        .setColor(0xdcde19)
        .setFooter(
            "Please avoid using this, it slows down the overall system."
        );

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });
    let res = await addAccounts(category, args.slice(0, -1));
    await tmpMsg.delete();
    return { res: res };
});
