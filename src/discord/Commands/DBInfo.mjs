import { MessageEmbed } from "discord.js";
import Account from "hyarcade-requests/types/Account.js";
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import CommandResponse from "../Utils/CommandResponse.js";
import Database from "../Utils/Database.js";

export default new Command(["dbinfo", "database"], ["*"], async (args, rawMsg, interaction) => {
  if(interaction != undefined) {
    await interaction.deferReply();
  }

  /**
   * @type {Account[]}
   */
  const info = await Database.info();

  const embed = new MessageEmbed()
    .setAuthor({ name: "Hyarcade Database info", iconURL: BotRuntime.client.user.avatarURL(), url: "https://hyarcade.xyz/" })
    .setDescription(`**Accounts** : \`${info.accs}\`\n` +
        `**Invalid Accounts** : \`${info.invalid}\`\n` +
        `**Linked Accounts** : \`${info.links}\`\n\n` +
        `**Guilds** : \`${info.guilds}\`\n\n` + 
        `**Memory** : \`${Math.floor(info.mem)}mb\`\n` +
        `**Start Time** : <t:${Math.floor((Date.now() / 1000) - info.time)}:R>\n` +
        `**File Save** : <t:${Math.floor((info.fileSave / 1000))}:R>`
    )
    .setColor(0x8c54fe);

  return new CommandResponse("", embed);
});
