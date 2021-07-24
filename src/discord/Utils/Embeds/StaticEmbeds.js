const { MessageEmbed } = require("discord.js");
const { COLOR_RED, COLOR_PRIMARY, COLOR_SUCCESS, COLOR_YELLOW } = require("./Colors");

const cfg = require("../../../Config").fromJSON();

exports.ERROR_UNKNOWN = new MessageEmbed()
        .setTitle("ERROR")
        .setColor(COLOR_RED)
        .setDescription("The command you tried to run caused an unknown error!")

exports.ERROR_NEED_PLAYER = new MessageEmbed()
    .setTitle("ERROR")
    .setColor(COLOR_RED)
    .setDescription("The player you specified does not seem to exist!");

exports.ERROR_UNLINKED = new MessageEmbed()
    .setTitle("ERROR")
    .setColor(COLOR_RED)
    .setDescription("You need to input an IGN or verify yourself.")


exports.FULL_HELP = new MessageEmbed()
    .setTitle("Arcade bot help")
    .setColor(COLOR_PRIMARY)
    .addField("/getdataraw", "Get some raw data from a player")
    .addField("/info", "Get info about the bot")
    .addField("/leaderboard", "Get an arcade leaderboard (Not availiable on micro)")
    .addField("/namehistory", "Get the list of previous names from a player")
    .addField("/stats", "Get the stats of a specified player")
    .addField("/verify", "Verify yourself with the arcade bot (Not availiable on micro)")
    .addField("/whois", "Get the linked discord account of a player (Not availiable on micro)")
    .addField("/help", "Get a list of commands of help on a specific topic")
    .addField(
        "Other help topics",
        "games - the names of all the available games\nsearching - how the bot searches for an account\nrole handling - an explantion on how role handling happens"
    );

exports.ERROR_API_DOWN = new MessageEmbed()
    .setTitle("ERROR")
    .setColor(COLOR_RED)
    .setDescription("Due to a hypixel api outage all commands are disabled to prevent errors.");

/**
 * For when someone has not put their discord tag into hypixel correctly
 */
exports.ERROR_LINK_HYPIXEL_MISMATCH = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(
        "Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. Try `/arcadehelp Verify` if you are still confused"
    )
    .setColor(COLOR_RED);

/**
 * Account link was successful
 */
exports.INFO_LINK_SUCCESS = new MessageEmbed()
    .setTitle("Success")
    .setDescription(`Account linked successfully!`)
    .setColor(COLOR_SUCCESS);

exports.ERROR_INPUT_IGN = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(
        `Input a name or uuid to link your discord to! Use ${cfg.commandCharacter}help for more info on how to use the verify command.`
    )
    .setColor(COLOR_RED);

exports.ERROR_IGN_UNDEFINED = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(`The ign you specified does not exist or has been changed.`)
    .setColor(COLOR_RED);

exports.ERROR_PLAYER_PREVIOUSLY_LINKED = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription("This player has already been linked!")
    .setColor(COLOR_RED);

exports.ERROR_ACCOUNT_PREVIOUSLY_LINKED = new MessageEmbed()
    .setTitle("ERROR")
    .setDescription("This user has already been linked!")
    .setColor(COLOR_RED);

exports.WARN_WAITING = new MessageEmbed()
    .setTitle("Waiting...")
    .setDescription(
        "Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!"
    )
    .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
    .setColor(COLOR_YELLOW)
    .setFooter(
        "Please avoid using this unless they should actually be in the database, too many people slows down the overall system."
    );