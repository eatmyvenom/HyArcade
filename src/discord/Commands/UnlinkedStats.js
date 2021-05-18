const Command = require("../../classes/Command");
const utils = require("../../utils");
const Account = require("../../account");
const mojangRequest = require("../../mojangRequest");
const BotUtils = require("../BotUtils");
const { MessageEmbed } = require("discord.js");

module.exports = new Command("UStats", ["*"], async (args, rawMsg) => {
    let embed = new MessageEmbed().setTitle("Waiting...").setDescription("Since the user is not in the database it will take some time to gather the stats. Please wait!").setThumbnail("https://i.imgur.com/GLdqYB2.gif").setColor(0xdcde19).setFooter("Please avoid using this, it slows down the overall system.");

    let tmpMsg = await rawMsg.channel.send("", { embed: embed });

    let plr = args[0];
    let game = "" + args[args.length - 1];
    let uuid;
    if (plr.length > 17) {
        uuid = plr;
    } else {
        uuid = await mojangRequest.getUUID(plr);
    }

    let acc = new Account("", 0, "" + uuid);
    await acc.updateData();
    await tmpMsg.delete();
    return await BotUtils.getStats(acc, game);
});
