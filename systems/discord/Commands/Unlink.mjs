import { Database } from "@hyarcade/requests";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export default new Command(["unlink", "uln", "uv", "fuv"], ["%trusted%"], async args => {
  if (args.length === 0) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }
  const player = args[0];
  const discord = args[1] ?? player;
  const list = await Database.readDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  await Database.unlinkDiscord(discord, player);
  await Database.unlinkDiscord(discord, disclist[discord]);

  return new CommandResponse(`ID: ${discord}, unlinked successfully!`);
});
