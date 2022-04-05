const { LOG_COMMAND_EXECUTION } = require("./Embeds/DynamicEmbeds");
const Webhooks = require("./Webhooks");
const BotRuntime = require("../BotRuntime");
const { MessageEmbed } = require("discord.js");

module.exports = class LogUtils {
  /**
   * Log a command run
   *
   * @param {string} command The command that was run
   * @param {string} args The arguments used with the command
   * @param {object} message The message object that the command came from
   */
  static async logCommand(command, args, message) {
    await Webhooks.commandHook.send({
      embeds: [LOG_COMMAND_EXECUTION(command, args, message)],
      avatarURL: BotRuntime?.client?.user?.avatarURL(),
      username: `${BotRuntime?.client?.user?.username} - Shard ${BotRuntime?.client?.shard?.ids ?? 0}`,
    });
  }

  static async logVerify(discord, ign) {
    await Webhooks.verifyHook.send({
      embeds: [new MessageEmbed({ title: "User verified", description: `${discord} - <@${discord}> was verified as "**${ign}**"` })],
    });
  }
};
