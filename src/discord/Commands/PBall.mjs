import { MessageEmbed } from "discord.js";
import { HypixelApi, mojangRequest } from "hyarcade-requests";
import Command from "../../classes/Command";
import CommandResponse from "../Utils/CommandResponse";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds";

/**
 * @param {number} n
 * @returns {string}
 */
function numberify (n) {
  const r = Intl.NumberFormat("en").format(Number(n).toFixed(2));
  return r;
}

export default new Command("paintball", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const uuid = plr.length > 31 ? plr : await mojangRequest.getUUID(plr);
  if(uuid == undefined) {
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }
  await interaction.defer();
  const acc = await HypixelApi.player(uuid);
  const data = acc.player;
  const embed = new MessageEmbed()
    .setTitle(`${data.displayname} Paintball stats`)
    .addField("-----Overall stats-----",
      `**Wins** - ${numberify(data?.stats?.Paintball?.wins ?? 0)}\n` +
            `**Kills** - ${numberify(data?.stats?.Paintball?.kills ?? 0)}\n` +
            `**Deaths** - ${numberify(data?.stats?.Paintball?.deaths ?? 0)}\n` +
            `**Shots** - ${numberify(data?.stats?.Paintball?.shots_fired ?? 0)}\n` +
            `**Forcefield** - ${numberify(data?.stats?.Paintball?.forcefieldTime ?? 0)}s\n` +
            `**Streaks** - ${numberify(data?.stats?.Paintball?.killstreaks ?? 0)}`,
      true
    )
    .addField("---------Info----------",
      `**Godfather** - ${numberify(data?.stats?.Paintball?.godfather ?? 0)}\n` +
            `**Endurance** - ${numberify(data?.stats?.Paintball?.endurance ?? 0)}\n` +
            `**Superluck** - ${numberify(data?.stats?.Paintball?.superluck ?? 0)}\n` +
            `**Fortune** - ${numberify(data?.stats?.Paintball?.fortune ?? 0)}\n` +
            `**Adrenaline** - ${numberify(data?.stats?.Paintball?.adrenaline ?? 0)}\n` +
            `**transfusion** - ${numberify(data?.stats?.Paintball?.transfusion ?? 0)}\n` +
            `**Coins** - ${numberify(data?.stats?.Paintball?.coins ?? 0)}`,
      true
    )
    .addField("---------Ratios--------",
      `**Kills/Deaths** - ${numberify((data?.stats?.Paintball?.kills ?? 0) / (data?.stats?.Paintball?.deaths ?? 0))}\n` +
            `**Kills/Wins** - ${numberify((data?.stats?.Paintball?.kills ?? 0) / (data?.stats?.Paintball?.wins ?? 0))}\n` +
            `**Deaths/Wins** - ${numberify((data?.stats?.Paintball?.deaths ?? 0) / (data?.stats?.Paintball?.wins ?? 0))}\n` +
            `**Shots/Wins** - ${numberify((data?.stats?.Paintball?.shots_fired ?? 0) / (data?.stats?.Paintball?.wins ?? 0))}\n` +
            `**Shots/Kills** - ${numberify((data?.stats?.Paintball?.shots_fired ?? 0) / (data?.stats?.Paintball?.kills ?? 0))}\n`,
      true
    )
    .setThumbnail(`https://crafatar.com/renders/head/${uuid}?overlay`)
    .setColor(0x44a3e7);
  return new CommandResponse("", embed);
});
