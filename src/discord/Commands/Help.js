const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const Config = require("../../Config").fromJSON();

function getHelp(cmd) {
    let usage = "";
    let desc = "";
    let title = "";
    switch (cmd.toLowerCase()) {
        case "help": {
            title = "Help command";
            usage = "help [command?]";
            desc = "Get info on how to use commands and what they do.";
            break;
        }

        case "linkme":
        case "verify": {
            title = "Verify command";
            usage = "verify [ign/uuid]";
            desc = "Link your discord to your account";
            break;
        }

        case "ln":
        case "link": {
            title = "Link command";
            usage = "link [account] [discordID]";
            desc = "Link a minecraft account to a discord ID.";
            break;
        }

        case "addacc":
        case "newacc": {
            title = "New Account command";
            usage = "newAcc [name] [category?]";
            desc = 'Add an account by name to the database. The category "Gamers" will refuse someone with less than 50 party games wins.';
            break;
        }

        case "s":
        case "stats": {
            title = "Stats command";
            usage = "stats [name] [arcade game?]";
            desc = "Give the general arcade stats of a player. If the arcade game argument is filled then it also adds stats from that game.";
            break;
        }

        case "sts":
        case "status": {
            title = "Status command";
            usage = "status [name?]";
            desc = "Get the current status of a player in the database.";
        }

        case "pglb":
        case "partygameslb":
        case "pgleaderboard":
        case "partygamesleaderboard": {
            title = "Party games leaderboard command";
            usage = "pglb [type] [amount]";
            desc =
                "`Deprecated!` use the leaderboard command instead\nGet the current party games leaderboard, type refers to either daily or overall. There is support for other arcade games coming soon.";
            break;
        }

        case "lb":
        case "lead":
        case "leaderboard":
        case "leadb": {
            title = "Leaderboard command";
            usage = "lb [game] [type] [amount?]";
            desc = "Get the current leaderboard from most arcade games, type refers to either daily or overall.";
            break;
        }

        case "games": {
            title = "Available games";
            usage = "s/lb [game]";
            desc =
                "use any of these with the leaderboard or stats command party\nfarmhunt\nhysays\nhitw\nminiwalls\nfootball\nenderspleef\nthrowout\ngalaxywars\ndragonwars\nbounty\nblockingdead\nhide\nzombies\nctw\npixelpainters\nThere are also short versions availiable";
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
            .addField("NewAcc - Trusted users only", "Add a new account to the database", false)
            .addField("Leaderboard", "Get the current leaderboard or the daily leaderboard of an arcade game", false)
            .addField("Stats", "Get the stats of a player", false)
            .addField("Status", "Get the status of a player", false)
            .addField("GetDataRaw", "Get the raw data from an account", false)
            .addField("GameCounts", "Get the amount of players in either all arcade games or just one", false)
            .addField("PGDaily", "Get the daily leaderboard for party games", false);

        return { res: "", embed: embed };
    } else {
        let info = getHelp(args[0]);
        let embed = new MessageEmbed().setTitle(info.title).setDescription(info.desc).setColor(0x000000);

        return { res: "", embed: embed };
    }
});
