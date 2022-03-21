import { CommandInteraction } from "discord.js";
import Logger from "hyarcade-logger";
import { Command } from "hyarcade-structures";
import CommandStorage from "../CommandStorage.mjs";

/**
 * @param args
 * @param rawMsg
 * @param {CommandInteraction} interaction
 */
async function DevCallback(args, rawMsg, interaction) {
  if (!interaction) {
    return;
  }

  const realArgs = args[0].split(" ");
  const command = realArgs[0];
  Logger.info(`Dev called ${command}`);
  const commandArgs = realArgs.slice(1);
  const author = interaction.user.id;

  await CommandStorage.getCommands();

  return await CommandStorage.execute(command, commandArgs, author, rawMsg, interaction);
}

const DevCommand = new Command(["dev"], "%trusted%", DevCallback, 0);

export default DevCommand;
