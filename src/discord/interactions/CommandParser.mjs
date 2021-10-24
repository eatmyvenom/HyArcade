import { addAccounts } from "../../listUtils.js";

import CommandResponse from "../Utils/CommandResponse.js";
import CommandStorage from "../CommandStorage.mjs";

import { createRequire } from "module";
import ButtonGenerator from "./Buttons/ButtonGenerator.js";
const require = createRequire(import.meta.url);
const { MessageEmbed, CommandInteraction } = require("discord.js");

/**
 *
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse | object}
 */
export default async (interaction) => {
  const commands = await CommandStorage.getCommands();
  const authorID = interaction.member.user.id;
  const opts = interaction.options;
  


  switch(interaction.commandName) {
  case "stats": {
    return commands.Stats.execute([opts.getString("player"), opts.getString("game"), opts.getString("time")], authorID, null, interaction);
  }

  case "leaderboard": {
    return await commands.Leaderboard.execute([opts.getString("game"), opts.getString("type"), opts.getInteger("start"), ], authorID, null, interaction);
  }

  case "add-account": {
    await interaction.defer({
      ephemeral: true
    });

    const names = opts.getString("accounts").split(/\s/g);
    let res = await addAccounts("others", names);
    res = `\`\`\`\n${res}\n\`\`\``;
    const embed = new MessageEmbed()
      .setTitle("Accounts added")
      .setDescription(res)
      .setFooter(
        "It will take a little while for these accounts to be fully added to the database, please be patient."
      )
      .setTimestamp(Date.now())
      .setColor(0x44a3e7);

    return new CommandResponse("", embed);
  }

  case "name-history": {
    const embed = new MessageEmbed()
      .setTitle("Use /whois")
      .setColor(0xd69323)
      .setDescription(
        "This command has been merged with /whois! That command will have name history and more."
      );

    return new CommandResponse("", embed);
  }

  case commands.WhoIS.name: {
    return await commands.WhoIS.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.GetDataRaw.name: {
    return await commands.GetDataRaw.execute([opts.getString("player"), opts.getString("path"), opts.getString("time")], authorID, null, interaction);
  }

  case commands.LinkMe.name: {
    return await commands.LinkMe.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.GameCounts.name: {
    return await commands.GameCounts.execute([opts.getString("game")], authorID, null, interaction);
  }

  case commands.Info.name: {
    return await commands.Info.execute([], authorID, null, interaction);
  }

  case commands.Susser.name: {
    return await commands.Susser.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.Compare.name: {
    return await commands.Compare.execute(
      [opts.getString("player1"), opts.getString("player2"), opts.getString("game")],
      authorID,
      null,
      interaction
    );
  }

  case commands.Profile.name: {
    return await commands.Profile.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.TopGames.name: {
    return await commands.TopGames.execute([opts.getString("player"), opts.getString("time")], authorID, null, interaction);
  }

  case commands.Quake.name: {
    return await commands.Quake.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.Zombies.name: {
    return await commands.Zombies.execute([opts.getString("player"), opts.getString("map")], authorID, null, interaction);
  }

  case commands.Arena.name: {
    return await commands.Arena.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.PBall.name: {
    return await commands.PBall.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.Walls.name: {
    return await commands.Walls.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "status": {
    return await commands.Status.execute([opts.getString("player")], authorID, null, interaction);
  }

  case commands.PartyGames.name: {
    return await commands.PartyGames.execute([opts.getString("player"), opts.getString("game")], authorID, null, interaction);
  }

  case "arcade": {
    switch(interaction.options.getSubCommand()) {
    case "ez" : {
      const buttons = await ButtonGenerator.getEZ();

      /** @type {CommandResponse} */
      const res = await commands.EZ.execute([], authorID, null, interaction);
      res.components = buttons;

      return res;
    }

    case "ping" : {
      return await commands.Ping.execute([], authorID, null, interaction);
    }

    case "help" : {
      return await commands.Help.execute([], authorID, null, interaction);
    }

    case "leaderboard": {
      return await commands.Leaderboard.execute([opts.getString("game"), opts.getString("type"), opts.getInteger("start"), ], authorID, null, interaction);
    }

    case "profile": {
      return await commands.Profile.execute([opts.getString("player")], authorID, null, interaction);
    }
    }

    break;
  }

  case "mini-walls": {
    await interaction.defer();
    switch(interaction.options.getSubCommand()) {
    case "stats" : {
      return await commands.MiniWalls.execute([opts.getString("player"), opts.getString("time")], authorID, null, interaction);
    }

    case "leaderboard" : {
      return await commands.MiniWallsLB.execute([opts.getString("type"), opts.getString("time"), opts.getString("amount")], authorID, null, interaction);
    }
    }
  }
  }
};
