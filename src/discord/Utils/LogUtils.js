const Webhooks = require("./Webhooks");
const {
  LOG_COMMAND_EXECUTION
} = require("./Embeds/DynamicEmbeds");
const {
  Message,
  Webhook
} = require("discord.js");
const BotRuntime = require("../BotRuntime");

module.exports = class LogUtils {

  /**
   * 
   * @param {Message} msg 
   * @param {Webhook} hook 
   */
  static async logcopy (msg, hook) {
    const pfp = msg.author.avatarURL();
    let name;
    if(msg.member) {
      name = msg.member.displayColor ?? "Unknown";
    }

    await hook.send({
      content: msg.content,
      username: name,
      avatarURL: pfp
    });
    await hook.send({
      content: msg.url,
      username: name,
      avatarURL: pfp
    });
  }

  /**
   * Log a command run
   *
   * @param {string} command The command that was run
   * @param {string} args The arguments used with the command
   * @param {Message} message The message object that the command came from
   */
  static async logCommand (command, args, message) {
    await Webhooks.commandHook.send({
      embeds: [LOG_COMMAND_EXECUTION(command, args, message)],
      avatarURL: BotRuntime?.client?.user?.avatarURL(),
      username: `${BotRuntime?.client?.user?.username} - Shard ${BotRuntime?.client?.shard?.ids ?? 0}`
    });
  }
};
