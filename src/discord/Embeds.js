const { MessageEmbed } = require("discord.js");

const cfg = require("../Config").fromJSON();

exports.waiting = new MessageEmbed()
    .setTitle("Waiting...")
    .setDescription("Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!")
    .setThumbnail("https://i.imgur.com/GLdqYB2.gif")
    .setColor(0xdcde19)
    .setFooter("Please avoid using this unless they should actually be in the database, too many people slows down the overall system.");

exports.accsAdded = function (res) {
    return new MessageEmbed().setTitle("Accounts added").setDescription(res).setFooter("It will take a little while for these accounts to be fully added to the database, please be patient.").setTimestamp(Date.now()).setColor(0x44a3e7);
};

exports.errIptIgn = new MessageEmbed().setTitle("ERROR").setDescription(`Input a name or uuid to link your discord to! Use ${cfg.commandCharacter}help for more info on how to use the verify command.`).setColor(0xff0000);

exports.errIgnNull = new MessageEmbed().setTitle("ERROR").setDescription(`The ign you specified does not exist or has been changed.`).setColor(0xff0000);

exports.errPlayerLinked = new MessageEmbed().setTitle("ERROR").setDescription("This player has already been linked!").setColor(0xff0000);

exports.errAccLinked = new MessageEmbed().setTitle("ERROR").setDescription("This user has already been linked!").setColor(0xff0000);

exports.linkSuccess = new MessageEmbed().setTitle("Success").setDescription(`Account linked successfully!`).setColor(0x00d492);

exports.errHypixelMismatch = new MessageEmbed().setTitle("ERROR").setDescription("Your discord tag does not match your hypixel set discord account. In order to link you must set your discord in hypixel to be your exact tag. If you are confused then just try linking via the hystats bot since it uses the same mechanism.").setColor(0xff0000);

exports.execution = function (name, args, author, link) {
    if (args == "") args = "none";
    return new MessageEmbed().setTitle("Command execution").setColor(0x2f3136).addField("Name", name, true).addField("Args", `\`${args}\``, true).addField("User", `<@${author}>`, true).addField("Link", `[Message Link](${link})`, true);
};

exports.dbded = new MessageEmbed()
    .setTitle("Command will not process")
    .setColor(0xff0000)
    .setDescription("Due to a database error this command will not be processed!")

exports.useSlash = function (cmd, slashver) {
    return new MessageEmbed()
        .setTitle(`The command ${cmd} is only available as "/${slashver}"!`)
        .setColor(0xff0000)
        .setDescription("This command has been retired and will no longer function using the usual method. Please use the slash command variation instead.")
}

exports.errLen = function(len) {
    return new MessageEmbed()
        .setTitle("ERROR")
        .setColor(0xff0000)
        .setDescription(`This command requires ${len} arguments`);
}

exports.slashUsed = function(userid, usertag, command, server, channel, options) {
    return new MessageEmbed()
        .setTitle(`Command run by ${usertag} <@${userid}>`)
        .setColor(0xff3399)
        .addField("Command", command, false)
        .addField("Server", server, true)
        .addField("Channel", `<#${channel}>`, true)
        .addField("Options", JSON.stringify(options), false);
}