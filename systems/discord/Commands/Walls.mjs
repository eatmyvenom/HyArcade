import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";

const { MessageEmbed } = require("discord.js");
const { HypixelApi, mojangRequest } = require("hyarcade-requests");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n).toFixed(2));
  return r;
}

export default new Command("walls", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const uuid = plr.length > 31 ? plr : await mojangRequest.getUUID(plr);
  if (uuid == undefined) {
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }
  await interaction.deferReply();
  const acc = await HypixelApi.player(uuid);
  const data = acc.player;
  const embed = new MessageEmbed()
    .setTitle(`${data.displayname} Walls stats`)
    .addField(
      "-----Overall stats-----",
      `**Wins** - ${numberify(data?.stats?.Walls?.wins ?? 0)}\n` +
        `**Losses** - ${numberify(data?.stats?.Walls?.losses ?? 0)}\n` +
        `**Kills** - ${numberify(data?.stats?.Walls?.kills ?? 0)}\n` +
        `**Assists** - ${numberify(data?.stats?.Walls?.assists ?? 0)}\n` +
        `**Deaths** - ${numberify(data?.stats?.Walls?.deaths ?? 0)}\n`,
      true,
    )
    .addField(
      "---------Info----------",
      `**Diamonds Mined** - ${numberify(data?.achievements?.walls_diamond_miner ?? 0)}\n` +
        `**Days played** - ${numberify(Array.from(data?.quests?.walls_daily_play?.completions ?? []))}\n` +
        `**Coins** - ${numberify(data?.stats?.Walls?.coins ?? 0)}`,
      true,
    )
    .addField(
      "---------Ratios--------",
      `**K/D** - ${numberify((data?.stats?.Walls?.kills ?? 0) / (data?.stats?.Walls?.deaths ?? 0))}\n` +
        `**K+A/D** - ${numberify(
          ((data?.stats?.Walls?.kills ?? 0) + (data?.stats?.Walls?.assists ?? 0)) / (data?.stats?.Walls?.wins ?? 0),
        )}\n` +
        `**D/Games** - ${numberify(
          (data?.stats?.Walls?.deaths ?? 0) / (data?.stats?.Walls?.wins ?? 0) + (data?.stats?.Walls?.losses ?? 0),
        )}\n` +
        `**K/Games** - ${numberify(
          (data?.stats?.Walls?.kills ?? 0) / (data?.stats?.Walls?.wins ?? 0) + (data?.stats?.Walls?.losses ?? 0),
        )}\n` +
        `**K+A/Games** - ${numberify(
          ((data?.stats?.Walls?.kills ?? 0) + (data?.stats?.Walls?.assists ?? 0)) / (data?.stats?.Walls?.wins ?? 0) +
            (data?.stats?.Walls?.losses ?? 0),
        )}\n`,
      true,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay`)
    .setColor(0x44a3e7);
  return new CommandResponse("", embed);
});
