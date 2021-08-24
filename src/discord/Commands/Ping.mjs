import { MessageEmbed } from "discord.js";
import Command from "../../classes/Command";
import { client } from "../BotUtils";
import CommandResponse from "../Utils/CommandResponse";
import TimeFormatter from "../Utils/Formatting/TimeFormatter";

const statusName = [
  "READY",
  "CONNECTING",
  "RECONNECTING",
  "IDLE",
  "NEARLY",
  "DISCONNECTED",
  "WAITING_FOR_GUILDS",
  "IDENTIFYING",
  "RESUMING"
];

export default new Command("ping", ["*"], async () => {
  const embed = new MessageEmbed()
    .setAuthor(`${client.user.username} status`, client.user.avatarURL(), "https://hyarcade.xyz/")
    .addField(
      "Status",
      `📡 Ping - ${client.ws.ping}ms\n` +
        `📟 Status - ${statusName[client.ws.status]}\n` +
        `⏲️ Start time - ${TimeFormatter(Date.now() - client.uptime)}\n`,
      true
    )
    .addField(
      "Info",
      `📊 Servers - ${client.guilds.cache.size}\n` +
        `📈 Users - ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\n` +
        `🗒️ Channels - ${client.channels.cache.size}`,
      true
    )
    .setColor(0x8c54fe);
  return new CommandResponse({
    res: "",
    embed
  });
});
