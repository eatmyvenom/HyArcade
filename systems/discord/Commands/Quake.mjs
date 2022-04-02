import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { createRequire } from "node:module";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";

const require = createRequire(import.meta.url);
const { HypixelApi, mojangRequest } = require("@hyarcade/requests");

const { MessageEmbed } = require("discord.js");

/**
 * @param {string} t
 * @returns {string}
 */
function fixTrigger(t = "") {
  return t
    .replace(/ZERO/g, "0")
    .replace(/ONE/g, "1")
    .replace(/TWO/g, "2")
    .replace(/THREE/g, "3")
    .replace(/FOUR/g, "4")
    .replace(/FIVE/g, "5")
    .replace(/SIX/g, "6")
    .replace(/SEVEN/g, "7")
    .replace(/EIGHT/g, "8")
    .replace(/NINE/g, "9")
    .replace(/_/g, "")
    .replace(/POINT/g, ".");
}

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
  const r = Intl.NumberFormat("en").format(Number(n).toFixed(2));
  return r;
}

export default new Command("quake", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const uuid = plr.length > 31 ? plr : await mojangRequest.getUUID(plr);
  if (uuid == undefined) {
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }
  await interaction.deferReply();
  const acc = await HypixelApi.player(uuid);
  const data = acc.player;
  const embed = new MessageEmbed()
    .setTitle(`${data.displayname} quake stats`)
    .addField(
      "-----Overall stats-----",
      `**Wins** - ${numberify(data?.stats?.Quake?.wins ?? 0)}\n` +
        `**Kills** - ${numberify(data?.stats?.Quake?.kills ?? 0)}\n` +
        `**Deaths** - ${numberify(data?.stats?.Quake?.deaths ?? 0)}\n` +
        `**Headshots** - ${numberify(data?.stats?.Quake?.headshots ?? 0)}\n` +
        `**Shots** - ${numberify(data?.stats?.Quake?.shots_fired ?? 0)}\n` +
        `**Streaks** - ${numberify(data?.stats?.Quake?.killstreaks ?? 0)}`,
      true,
    )
    .addField(
      "---------Info----------",
      `**Dash** - ${numberify(data?.stats?.Quake?.dash_cooldown ?? 4)}\n` +
        `**Trigger** - ${fixTrigger(data?.stats?.Quake?.trigger ?? "1.5")}s\n` +
        `**Highest streak** - ${numberify(data?.stats?.Quake?.highest_killstreak ?? 0)}\n` +
        `**Coins** - ${numberify(data?.stats?.Quake?.coins ?? 0)}`,
      true,
    )
    .addField(
      "---------Ratios--------",
      `**Kills/Deaths** - ${numberify((data?.stats?.Quake?.kills ?? 0) / (data?.stats?.Quake?.deaths ?? 0))}\n` +
        `**Kills/Wins** - ${numberify((data?.stats?.Quake?.kills ?? 0) / (data?.stats?.Quake?.wins ?? 0))}\n` +
        `**Deaths/Wins** - ${numberify((data?.stats?.Quake?.deaths ?? 0) / (data?.stats?.Quake?.wins ?? 0))}\n` +
        `**Headshot/Shots** - ${numberify((data?.stats?.Quake?.headshots ?? 0) / (data?.stats?.Quake?.shots_fired ?? 0))}\n` +
        `**Shots/Kills** - ${numberify((data?.stats?.Quake?.shots_fired ?? 0) / (data?.stats?.Quake?.kills ?? 0))}\n`,
      true,
    )
    .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay`)
    .setColor(0x44a3e7);
  return new CommandResponse("", embed);
});
