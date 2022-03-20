const { MessageEmbed, Message, CommandInteraction, MessageComponentInteraction } = require("discord.js");
const { COLOR_PRIMARY, COLOR_RED, COLOR_PURPLE, COLOR_SUCCESS, COLOR_PINK } = require("./Colors");

exports.INFO_ACCOUNTS_ADDED = function (res) {
  return new MessageEmbed()
    .setTitle("Accounts added")
    .setDescription(res)
    .setFooter({
      text: "It will take a little while for these accounts to be fully added to the database, please be patient.",
    })
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
  const argsTxt = args == "" ? "`none`" : `\`${args}\``;
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
    .setDescription("This command has been retired and will no longer function using the usual method. Please use the slash command variation instead.");
};

exports.ERROR_ARGS_LENGTH = function (len) {
  return new MessageEmbed().setTitle("ERROR").setColor(COLOR_RED).setDescription(`This command requires ${len} arguments`);
};

/**
 *
 * @param {CommandInteraction} interaction
 * @returns {MessageEmbed}
 */
exports.LOG_SLASH_COMMAND_USAGE = function (interaction) {
  return new MessageEmbed()
    .setTitle(`Command run`)
    .setColor(COLOR_SUCCESS)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
    .addField("Command", `${interaction.commandName}`, false)
    .addField("User", `<@${interaction.user.id}>\n- \`${interaction.user.id}\``, true)
    .addField("Server", `\` ${interaction.guild.name} \`\n- \`${interaction.guild.id}\``, true)
    .addField("Channel", `<#${interaction.channel.id}>\n- \`${interaction.channel.name}\`\n- \`${interaction.channel.id}\``, true)
    .addField("Options", `\`${JSON.stringify(interaction.options.data)}\``, false)
    .setFooter({ text: `${interaction.id}` });
};

/**
 *
 * @param {MessageComponentInteraction} interaction
 * @returns {MessageEmbed}
 */
exports.LOG_MESSAGE_COMPONENT_USAGE = function (interaction) {
  return new MessageEmbed()
    .setTitle(`${interaction.componentType} component used`)
    .setColor(COLOR_PURPLE)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
    .addField("ID", `\`${interaction.customId}\``, false)
    .addField("Values", `\`${interaction.values?.join(", ")}\``, false)
    .addField("User", `<@${interaction.user.id}>\n- \`${interaction.user.id}\``, true)
    .addField("Server", `\` ${interaction.guild.name} \`\n- \`${interaction.guild.id}\``, true)
    .addField("Channel", `<#${interaction.channel.id}>\n- \`${interaction.channel.name}\`\n- \`${interaction.channel.id}\``, true)
    .setFooter({ text: `${interaction?.message?.interaction?.id ?? "MSG"}` });
};

exports.INFO_WHOIS = function (acc) {
  return new MessageEmbed().setTitle(`${acc.name} discord`).setDescription(`Discord ID: ${acc.discord}\n<@${acc.discord}>`).setColor(COLOR_PRIMARY);
};

exports.ERROR_WAS_NOT_IN_DATABASE = function (ign) {
  return new MessageEmbed().setTitle("ERROR").setDescription(`${ign} was not in the database at the time period you requested!`).setColor(COLOR_RED);
};

/**
 *
 * @param {Error} error
 * @param {string} note
 * @returns {MessageEmbed}
 */
exports.ERROR_LOG = function (error, note) {
  return new MessageEmbed()
    .setTitle("ERROR")
    .setDescription(note)
    .addField("Error", `\`${error.message}\``)
    .addField("Stack", `\`${error.stack.slice(0, Math.min(1000, error.stack.length))}\``);
};
