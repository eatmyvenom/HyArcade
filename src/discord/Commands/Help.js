const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const HelpText = require("../HelpText");
const Config = require("../../Config").fromJSON();

function getHelp(cmd) {
    let usage = "";
    let desc = "";
    let title = "";
    switch (cmd.toLowerCase()) {
        case "help": {
            title = "Help command";
            usage = "help [command?]";
            desc = HelpText.help;
            break;
        }

        case "linkme":
        case "verify": {
            title = "Verify command";
            usage = "verify [ign/uuid]";
            desc = HelpText.verify;
            break;
        }

        case "ln":
        case "link": {
            title = "Link command";
            usage = "link [ign/uuid] [discordID]";
            desc = HelpText.link;
            break;
        }

        case "addacc":
        case "newacc": {
            title = "New Account command";
            usage = "newAcc [names...]";
            desc = HelpText.newacc;
            break;
        }

        case "s":
        case "stats": {
            title = "Stats command";
            usage = "stats [name] [arcade game?]";
            desc = HelpText.stats;
            break;
        }

        case "us":
        case "ustats":
        case "ulinkedstats":
        case "unlinkedstats": {
            title = "UnlinkedStats command";
            usage = "ustats [name] [arcade game?]";
            desc = HelpText.unlinkedstats;
            break;
        }

        case "sts":
        case "status": {
            title = "Status command";
            usage = "status [name?]";
            desc = HelpText.status;
        }

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            title = "Leaderboard command";
            usage = "lb [game] [type] [amount?]";
            desc = HelpText.lb;
            break;
        }

        case "games": {
            title = "Available games";
            usage = "s/lb [game]";
            desc = HelpText.games;
            break;
        }

        case "getdataraw":
        case "getraw":
        case "dataraw": {
            title = "Get data raw";
            usage = "getraw [name?] [field]";
            desc = HelpText.getraw;
            break;
        }
    }

    if (title == "") {
        return { title: "Not found", desc: "That command was not found" };
    }
    desc = "`" + Config.commandCharacter + usage + "`\n" + desc;
    return { title: title, desc: desc };
}

module.exports = new Command("Help", ["*"], async (args) => {
    if (args.length == 0) {
        let embed = new MessageEmbed()
            .setTitle("Availiable commands")
            .setColor(0x000000)
            .addField("Help", "Get this message or get help on a specific command", false)
            .addField("Verify", "Link a your discord id to your minecraft account", false)
            .addField("Link - Trusted users only", "Link a players discord id to their minecraft account, use Verify if you aren't a trusted user", false)
            .addField("NewAcc ", "Add a new account to the database", false)
            .addField("Leaderboard", "Get the current leaderboard or the daily leaderboard of an arcade game", false)
            .addField("Stats", "Get the stats of a player", false)
            .addField("UnlinkedStats", "Get the stats of a player that has not been added to the database", false)
            .addField("Status", "Get the status of a player", false)
            .addField("GetDataRaw", "Get the raw data from an account", false)
            .addField("GameCounts", "Get the amount of players in either all arcade games or just one", false)
            .addField("PGDaily", "Get the daily leaderboard for party games", false);

        return { res: "", embed: embed };
    } else {
        let info = getHelp(args[0]);
        let embed = new MessageEmbed().setTitle(info.title).setDescription(info.desc).setColor(0x00b37b);

        return { res: "", embed: embed };
    }
});
