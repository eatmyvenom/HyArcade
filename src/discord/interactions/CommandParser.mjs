import logger from "hyarcade-logger";
import { addAccounts } from "../../listUtils.js";

import CommandResponse from "../Utils/CommandResponse.js";

import EZ from "../Commands/EZ.mjs";
import Info from "../Commands/Info.mjs";
import Susser from "../Commands/Susser.js";
import GameCounts from "../Commands/GameCounts.js";
import Leaderboard from "../Commands/Leaderboard.js";
import ButtonGenerator from "./Buttons/ButtonGenerator.js";
import Ping from "../Commands/Ping.mjs";
import GetDataRaw from "../Commands/GetDataRaw.js";
import TopGames from "../Commands/TopGames.mjs";
import Help from "../Commands/Help.js";
import Stats from"../Commands/Stats.js";
import Quake from "../Commands/Quake.mjs";
import Arena from "../Commands/Arena.mjs";
import PBall from "../Commands/PBall.mjs";
import Zombies from "../Commands/Zombies.mjs";
import Walls from "../Commands/Walls.mjs";
import { Profile } from "../Commands/Profile.mjs";
import { WhoIS } from "../Commands/WhoIS.mjs";
import { Verify } from "../Commands/LinkMe.mjs";
import { Compare } from "../Commands/Compare.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { MessageEmbed, CommandInteraction } = require("discord.js");


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

  case Leaderboard.name: {
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

    const names = opts.getString("accounts").split(" ");
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

  case WhoIS.name: {
    return await WhoIS.execute([opts.getString("player")], authorID, null, interaction);
  }

  case GetDataRaw.name: {
    return await GetDataRaw.execute([opts.getString("player"), opts.getString("path")], authorID, null, interaction);
  }

  case Verify.name: {
    return await Verify.execute([opts.getString("player")], authorID, null, interaction);
  }

  case GameCounts.name: {
    return await GameCounts.execute([opts.getString("game")], authorID, null, interaction);
  }

  case Info.name: {
    return await Info.execute([], authorID, null, interaction);
  }

  case Susser.name: {
    return await Susser.execute([opts.getString("player")], authorID, null, interaction);
  }

  case Compare.name: {
    return await Compare.execute(
      [opts.getString("player1"), opts.getString("player2"), opts.getString("game")],
      authorID,
      null,
      interaction
    );
  }

  case Profile.name: {
    return await Profile.execute([opts.getString("player")], authorID, null, interaction);
  }

  case TopGames.name: {
    return await TopGames.execute([opts.getString("player"), opts.getString("time")], authorID, null, interaction);
  }

  case Quake.name: {
    return await Quake.execute([opts.getString("player")], authorID, null, interaction);
  }

  case Zombies.name: {
    return await Zombies.execute([opts.getString("player"), opts.getString("map")], authorID, null, interaction);
  }

  case Arena.name: {
    return await Arena.execute([opts.getString("player")], authorID, null, interaction);
  }

  case PBall.name: {
    return await PBall.execute([opts.getString("player")], authorID, null, interaction);
  }

  case Walls.name: {
    return await Walls.execute([opts.getString("player")], authorID, null, interaction);
  }

  case "arcade": {
    switch(interaction.options.getSubCommand()) {
    case "ez" : {
      logger.debug("Adding ez button to message");
      const buttons = await ButtonGenerator.getEZ();

      /** @type {CommandResponse} */
      const res = await EZ.execute([], authorID, null, interaction);
      res.components = buttons;

      return res;
    }

    case "ping" : {
      return await Ping.execute([], authorID, null, interaction);
    }

    case "help" : {
      return await Help.execute([], authorID, null, interaction);
    }
    }
  }
  }
};
