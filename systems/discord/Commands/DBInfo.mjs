import { MessageEmbed } from "discord.js";
import Database from "hyarcade-requests/Database.js";
import Account from "hyarcade-requests/types/Account.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import BotRuntime from "../BotRuntime.js";

export default new Command(["dbinfo", "database"], ["*"], async (args, rawMsg, interaction) => {
  if (interaction != undefined) {
    await interaction.deferReply();
  }

  /**
   * @type {Account[]}
   */
  const info = await Database.info();

  const embed = new MessageEmbed()
    .setAuthor({
      name: "Hyarcade Database info",
      iconURL: BotRuntime.client.user.avatarURL(),
      url: "https://hyarcade.xyz/",
    })
    .setDescription(
      `**Accounts** : \`${info.accs}\`\n` + `**Linked Accounts** : \`${info.links}\`\n\n` + `**Guilds** : \`${info.guilds}\`\n\n` + `**Memory** : \`${Math.floor(info.mem)}mb\`\n`,
    )
    .setColor(0x8c54fe);

  return new CommandResponse("", embed);
});
