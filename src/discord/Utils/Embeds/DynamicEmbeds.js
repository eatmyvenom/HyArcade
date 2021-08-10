const {
    MessageEmbed,
    Message
} = require("discord.js");
const {
    COLOR_PRIMARY,
    COLOR_RED,
    COLOR_PURPLE,
    COLOR_SUCCESS,
    COLOR_PINK
} = require("./Colors");

exports.INFO_ACCOUNTS_ADDED = function (res) {
    return new MessageEmbed()
        .setTitle("Accounts added")
        .setDescription(res)
        .setFooter(
            "It will take a little while for these accounts to be fully added to the database, please be patient."
        )
        .setTimestamp(Date.now())
        .setColor(COLOR_PRIMARY);
};

/**
 * 
 * @param {string} name 
 * @param {string[]} args 
 * @param {Message} message 
 * @returns {MessageEmbed}
 */
exports.LOG_COMMAND_EXECUTION = function (name, args, message) {
    const argsTxt = (args == "") ? "`none`" : `\`${args}\``;
    return new MessageEmbed()
        .setTitle("Command execution")
        .setColor(COLOR_PINK)
        .addField("Name", name, true)
        .addField("Args", argsTxt, true)
        .addField("User", `${message.author.tag} - <@${message.author.id}>`, true)
        .addField("Location", `${message.guild.name}#${message.channel.name}`, true)
        .addField("Link", `[Message Link](${message.url})`, true);
};

exports.ERROR_DATABASE_ERROR = new MessageEmbed()
    .setTitle("Command will not process")
    .setColor(COLOR_RED)
    .setDescription("Due to a database error this command will not be processed!");

exports.ERROR_USE_SLASH_COMMAND = function (cmd, slashver) {
    return new MessageEmbed()
        .setTitle(`The command ${cmd} is only available as "/${slashver}"!`)
        .setColor(COLOR_RED)
        .setDescription(
            "This command has been retired and will no longer function using the usual method. Please use the slash command variation instead."
        );
};

exports.ERROR_ARGS_LENGTH = function (len) {
    return new MessageEmbed().setTitle("ERROR")
        .setColor(COLOR_RED)
        .setDescription(`This command requires ${len} arguments`);
};

exports.LOG_SLASH_COMMAND_USAGE = function (userid, usertag, command, server, channel, options) {
    return new MessageEmbed()
        .setTitle(`Command run by ${usertag}`)
        .setColor(COLOR_SUCCESS)
        .addField("Command", `${command}`, false)
        .addField("User", `<@${userid}>`, true)
        .addField("Server", `${server}`, true)
        .addField("Channel", `<#${channel}>`, true)
        .addField("Options", `\`${JSON.stringify(options)}\``, false);
};

exports.LOG_MESSAGE_COMPONENT_USAGE = function (userid, usertag, componentID, values, server, channel) {
    return new MessageEmbed()
        .setTitle(`Component used by ${usertag}`)
        .setColor(COLOR_PURPLE)
        .addField("ID", `\`${componentID}\``, false)
        .addField("User", `<@${userid}>`, true)
        .addField("Server", `${server}`, true)
        .addField("Channel", `<#${channel}>`, true)
        .addField("Values", `\`${values?.join(", ")}\``, false);
};

exports.INFO_WHOIS = function (acc) {
    return new MessageEmbed()
        .setTitle(`${acc.name} discord`)
        .setDescription(`Discord ID: ${acc.discord}\n<@${acc.discord}>`)
        .setColor(COLOR_PRIMARY);
};
