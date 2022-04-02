import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import CommandStorage from "../CommandStorage.mjs";

/**
 *
 * @returns {object}
 */
async function reloadHander() {
  await CommandStorage.initCommands();

  return new CommandResponse("Commands reloaded");
}

export default new Command("reload", ["156952208045375488"], reloadHander, 0);
