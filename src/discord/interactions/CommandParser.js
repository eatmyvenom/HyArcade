const BotUtils = require("../BotUtils");
const { addAccounts } = require("../../listUtils");
const Leaderboard = require("../Commands/Leaderboard");
const InteractionUtils = require("./InteractionUtils");
const { MessageEmbed } = require("discord.js");

module.exports = async (interaction) => {
    let authorID = interaction.member.user.id;
    let opts = [].concat(interaction.data.options);
    let args = [];
    for (let i = 0; i < opts.length; i++) {
        if(opts[i] != undefined) {
            args[i] = opts[i].value;
        } else {
            args[i] = undefined;
        }
    }

    switch(interaction.data.name.toLowerCase()) {
        case "stats": {
            let game = args[1];
            let acc = await InteractionUtils.resolveAccount(interaction);
            return await BotUtils.getStats(acc, "" + game);
        }

        case "leaderboard": {
            return await Leaderboard.execute(args, authorID);
        }

        case "addaccount": {
            await InteractionUtils.sendEphemeralMsg(interaction);
            let names = args[0].split(" ");
            let res = await addAccounts("others", names);
            res = "```\n" + res + "\n```";
            let embed = new MessageEmbed()
                .setTitle("Accounts added")
                .setDescription(res)
                .setFooter(
                    "It will take a little while for these accounts to be fully added to the database, please be patient."
                )
                .setTimestamp(Date.now())
                .setColor(0x44a3e7);
            return { res: "", embed: embed };
        }
    }
}