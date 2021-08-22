const {
  MessageEmbed
} = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const Command = require("../../classes/Command");
const { getFromDB } = require("../BotUtils");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("dbinfo", ["*"], async () => {

  /**
   * @type {Account[]}
   */
  const accs = await getFromDB("accounts");

  const embed = new MessageEmbed()
    .setAuthor("Hyarcade database info", BotUtils.client.user.avatarURL(), "https://hyarcade.xyz/")
    .setDescription(`**Accounts** : ${accs.length}\n` +
        `**Invalid Accounts** : ${accs.filter((a) => a.name == "INVALID-NAME").length}\n` +
        `**Linked Accounts** : ${accs.filter((a) => (a.discord ?? "") != "").length}`
    )
    .setColor(0x8c54fe);

  return new CommandResponse("", embed);
});
