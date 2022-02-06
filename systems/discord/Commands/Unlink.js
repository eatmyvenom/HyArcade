const Database = require("hyarcade-requests/Database");
const Command = require("hyarcade-structures/Discord/Command");
const CommandResponse = require("hyarcade-structures/Discord/CommandResponse");
const BotRuntime = require("../BotRuntime");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");

module.exports = new Command(["unlink", "uln"], ["%trusted%"], async args => {
  if (args.length === 0) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }
  let player = args[0];
  let discord = args[1] ?? player;
  const list = await BotRuntime.getFromDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  await Database.unlinkDiscord(discord, player);
  await Database.unlinkDiscord(discord, disclist[discord]);

  return new CommandResponse(`ID: ${discord}, unlinked successfully!`);
});
