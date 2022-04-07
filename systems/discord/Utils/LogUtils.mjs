import { LOG_COMMAND_EXECUTION } from "./Embeds/DynamicEmbeds.js";
import Webhooks from "./Webhooks.js";
import { client } from "../BotRuntime.js";
import discordJS from "discord.js";

class LogUtils {
  /**
   * Log a command run
   *
   * @param {string} command The command that was run
   * @param {string} args The arguments used with the command
   * @param {object} message The message object that the command came from
   */
  async logCommand(command, args, message) {
    await Webhooks.commandHook.send({
      embeds: [LOG_COMMAND_EXECUTION(command, args, message)],
      avatarURL: client?.user?.avatarURL(),
      username: `${client?.user?.username} - Shard ${client?.shard?.ids ?? 0}`,
    });
  }

  async logVerify(discord, ign) {
    await Webhooks.verifyHook.send({
      embeds: [
        new discordJS.MessageEmbed({ title: "User verified", description: `${discord} - <@${discord}> was verified as "**${ign}**"` }),
      ],
    });
  }
}

export default new LogUtils();
