const BotUtils = require("../BotUtils");
const { addAccounts } = require("../../listUtils");
const Leaderboard = require("../Commands/Leaderboard");
const Verify = require("../Commands/LinkMe");
const GameCounts = require("../Commands/GameCounts");
const Boosters = require("../Commands/Boosters");
const Status = require("../Commands/Status");
const InteractionUtils = require("./InteractionUtils");
const Info = require("../Commands/Info");
const { MessageEmbed } = require("discord.js");
const Account = require("../../account");
const mojangRequest = require("../../mojangRequest");

module.exports = async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.guildID == '808077828842455090') return;
    let authorID = interaction.member.user.id;
    let opts = [].concat(interaction.options);
    let args = [];
    for (let i = 0; i < opts.length; i++) {
        if (opts[i] != undefined) {
            args[i] = opts[i].value;
        } else {
            args[i] = undefined;
        }
    }

    switch (interaction.commandName) {
        case "stats": {
            let game = args[1];
            let acc = await InteractionUtils.resolveAccount(interaction);
            return await BotUtils.getStats(acc, "" + game);
        }

        case "leaderboard": {
            return await Leaderboard.execute(args, authorID);
        }

        case "addaccount": {
            await interaction.defer();
            let names = args[0].split(" ");
            let res = await addAccounts("others", names);
            res = "```\n" + res + "\n```";
            let embed = new MessageEmbed().setTitle("Accounts added").setDescription(res).setFooter("It will take a little while for these accounts to be fully added to the database, please be patient.").setTimestamp(Date.now()).setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "unlinkedstats": {
            await interaction.defer();
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
            return await BotUtils.getStats(acc, game);
        }

        case "namehistory": {
            let acc = await InteractionUtils.resolveAccount(interaction);
            let embed = new MessageEmbed().setTitle(`${acc.name} IGN history`).setDescription(acc.nameHist).setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "whois": {
            let acc = await InteractionUtils.resolveAccount(interaction);
            let embed = new MessageEmbed().setTitle(`${acc.name} discord`).setDescription(`Discord ID: ${acc.discord}\n<@${acc.discord}>`).setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "getdataraw": {
            let acc = await InteractionUtils.resolveAccount(interaction, 1);
            let path = args[0];
            let embed = new MessageEmbed()
                .setTitle(acc.name + "." + path)
                .setDescription(acc[path])
                .setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "verify": {
            return await Verify.execute(args, authorID, null, interaction);
        }

        case "gamecounts": {
            return await GameCounts.execute(args, authorID, null, interaction);
        }

        case "status": {
            return await Status.execute(args, authorID, null, interaction);
        }

        case "info": {
            return await Info.execute(args, authorID, null, interaction);
        }

        case Boosters.name: {
            return await Boosters.execute(args, authorID, null, interaction);
        }

        case "help": {
            if(args.length == 0) {
                return { res : "" , embed : InteractionUtils.helpEmbed()};
            } else {
                return { res : "" , embed : InteractionUtils.helpTopic(args[0])};
            }
        }
    }
};
