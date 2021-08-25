import logger from "hyarcade-logger";
import { addAccounts } from "../../listUtils";
import { MessageEmbed, CommandInteraction } from "discord.js";

import CommandResponse from "../Utils/CommandResponse";

import EZ from "../Commands/EZ.mjs";
import Info from "../Commands/Info.mjs";
import Susser from "../Commands/Susser";
import GameCounts from "../Commands/GameCounts";
import LastUpdate from "../Commands/LastUpdate";
import Leaderboard from "../Commands/Leaderboard";
import ButtonGenerator from "./Buttons/ButtonGenerator";
import Ping from "../Commands/Ping.mjs";
import GetDataRaw from "../Commands/GetDataRaw";
import TopGames from "../Commands/TopGames.mjs";
import Help from "../Commands/Help";
import Stats from"../Commands/Stats";
import Quake from "../Commands/Quake.mjs";
import Arena from "../Commands/Arena.mjs";
import PBall from "../Commands/PBall.mjs";
import Zombies from "../Commands/Zombies.mjs";
import Walls from "../Commands/Walls.mjs";
import { Profile } from "../Commands/Profile";
import { WhoIS } from "../Commands/WhoIS.mjs";
import { Verify } from "../Commands/LinkMe.mjs";
import { Compare } from "../Commands/Compare.mjs";


/**
 *
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse | object}
 */
export default async (interaction) => {
  if(interaction.guildID == "808077828842455090") return;
  const authorID = interaction.member.user.id;
  const opts = interaction.options;

  switch(interaction.commandName) {
  case "stats": {
    return Stats.execute([opts.getString("player"), opts.getString("game")], authorID, null, interaction);
  }

  case "leaderboard": {
    const res = await Leaderboard.execute(
      [
        opts.getString("game"),
        opts.getString("type"),
        opts.getInteger("amount"),
        opts.getInteger("start"),
      ],
      authorID,
      null,
      interaction
    );
    const e = res.embed;
    if(res.game != undefined) {
      const buttons = await ButtonGenerator.getLBButtons(res.start, res.game, opts.getString("type"));
      return new CommandResponse("", e, undefined, buttons);
    }
    return new CommandResponse("", e);
  }

  case "add-account": {
    await interaction.defer({
      ephemeral: true
    });

    const names = opts.getString("accounts").value.split(" ");
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
    return {
      res: "",
      embed
    };
  }

  case "unlinkedstats": {
    const embed = new MessageEmbed()
      .setTitle("Use /stats")
      .setColor(0xd69323)
      .setDescription(
        "This command has been merged with /stats! If you are having troubles getting an unlinked player then use their uuid instead."
      );

    return {
      res: undefined,
      embed
    };
  }

  case "name-history": {
    const embed = new MessageEmbed()
      .setTitle("Use /whois")
      .setColor(0xd69323)
      .setDescription(
        "This command has been merged with /whois! That command will have name history and more."
      );

    return {
      res: undefined,
      embed
    };
  }

  case "whois": {
    return await WhoIS.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "get-data-raw": {
    return await GetDataRaw.execute([opts.getString("player"), opts.getString("path")], authorID, null, interaction);
  }

  case "verify": {
    return await Verify.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "game-counts": {
    return await GameCounts.execute([opts.getString("game")], authorID, null, interaction);
  }

  case "info": {
    return await Info.execute([], authorID, null, interaction);
  }

  case Susser.name: {
    return await Susser.execute([opts.getString("player")], authorID, null, interaction);
  }

  case Compare.name: {
    return await Compare.execute(
      [opts.getString("player2"), opts.getString("player2"), opts.getString("game")],
      authorID,
      null,
      interaction
    );
  }

  case Profile.name: {
    return await Profile.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "top-games": {
    return await TopGames.execute([opts.getString("player"), opts.getString("time")], authorID, null, interaction);
  }

  case "quake": {
    return await Quake.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "zombies": {
    return await Zombies.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "arena": {
    return await Arena.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "paintball": {
    return await PBall.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "walls": {
    return await Walls.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "arcade": {
    if(interaction.options.getSubCommand() == "ez") {
      logger.debug("Adding ez button to message");
      const buttons = await ButtonGenerator.getEZ();
      const res = await EZ.execute([], authorID, null, interaction);
      res.b = buttons;
      return res;
    }

    if(interaction.options.getSubCommand() == "lastupdate") {
      return await LastUpdate.execute([], authorID, null, interaction);
    }

    if(interaction.options.getSubCommand() == "ping") {
      return await Ping.execute([], authorID, null, interaction);
    }

    if(interaction.options.getSubCommand() == "help") {
      return await Help.execute([], authorID, null, interaction);
    }
  }
  }
};
