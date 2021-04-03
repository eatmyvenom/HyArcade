const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const Config = require("../../Config").fromJSON();

function getHelp(cmd) {
    let usage = "";
    let desc = "";
    let title = "";
    switch(cmd.toLowerCase()) {
        case "help": {
            title = "Help command";
            usage = "help [command?]"
            desc = "Get info on how to use commands and what they do."
            break;
        }

        case "ln":
        case "link": {
            title = "Link command"
            usage = "link [account] [discordID]"
            desc = "Link a minecraft account to a discord ID."
            break;
        }

        case "addacc":
        case "newacc": {
            title = "New Account command"
            usage = "newAcc [name] [category?]"
            desc = "Add an account by name to the database. The category \"Gamers\" will refuse someone with less than 50 party games wins."
            break;
        }

        case "s":
        case "stats": {
            title = "Stats command"
            usage = "stats [name] [arcade game?]"
            desc = "Give the general arcade stats of a player. If the arcade game argument is filled then it also adds stats from that game."
        }

        case "pglb":
        case "partygameslb":
        case "pgleaderboard":
        case "partygamesleaderboard": {
            title = "Party games leaderboard command"
            usage = "pglb [type] [amount]"
            desc = "Get the current party games leaderboard, type refers to either daily or overall. There is support for other arcade games coming soon."
        }
    }

    desc = "`" + Config.commandCharacter + usage + "`\n" + desc;
    return {title : title, desc : desc};
}

module.exports = new Command("Help", ["*"], async (args) => {
    if (args.length == 0) {
        let embed = new MessageEmbed()
            .setTitle("Availiable commands")
            .setColor(0x000000)
            .addField("Help", "Get this message", false)
            .addField("Link", "Link a players discord id to their minecraft account", false)
            .addField("NewAcc", "Add a new account to the database", false)
            .addField("PgLeaderboard", "Get the current party games leaderboard or the daily leaderboard", false)
            .addField("Stats", "Get the stats of a player", false);

        return {res : "", embed : embed}
    } else {
        let info = getHelp(args[0]);
        let embed = new MessageEmbed()
            .setTitle(info.title)
            .setDescription(info.desc)
            .setColor(0x000000)

        return {res : "", embed : embed} 
    }
});
