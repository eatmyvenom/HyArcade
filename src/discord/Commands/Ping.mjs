import { createRequire } from "module";
const require = createRequire(import.meta.url);
import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import CommandResponse from "../Utils/CommandResponse.js";
const { MessageEmbed } = require("discord.js");

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
    .setAuthor(`${BotRuntime.client.user.username} status`, BotRuntime.client.user.avatarURL(), "https://hyarcade.xyz/")
    .addField(
      "Status",
      `**Ping** : \`${BotRuntime.client.ws.ping}ms\`\n` +
        `**Status** : \`${statusName[BotRuntime.client.ws.status]}\`\n` +
        `**Start time** : <t:${Math.floor((Date.now() - BotRuntime.client.uptime) / 1000)}:R>\n`,
      true
    )
    .addField(
      "Info",
      `**Servers** : \`${BotRuntime.client.guilds.cache.size}\`\n` +
        `**Users** : \`${BotRuntime.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\n` +
        `**Channels** : \`${BotRuntime.client.channels.cache.size}\``,
      true
    )
    .setColor(0x8c54fe);
  return new CommandResponse({
    res: "",
    embed
  });
});
