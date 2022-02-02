import { createRequire } from "module";
import Logger from "hyarcade-logger";
import Dev from "./AvailableCommands/Dev.js";
import fullInteractionObjects from "./AvailableCommands/General.js";
import MiniWallsInteractionObjects from "./AvailableCommands/MiniWalls.js";
import BotRuntime from "../../BotRuntime.js";

const require = createRequire(import.meta.url);
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
export default async function (client) {
  let interactionObjects = fullInteractionObjects;
  Logger.info("Registering global commands with discord");
  if (BotRuntime.botMode == "mw") {
    interactionObjects = MiniWallsInteractionObjects;
  }

  const cmdarr = Object.values(interactionObjects);

  const { guilds } = client;
  guilds.cache.values();

  for (const g of guilds.cache.values()) {
    try {
      if (BotRuntime.botMode != "test") {
        await g.commands.set([]);
        if (g.id == "863563983936290846") {
          await g.commands.set(Object.values(Dev));
        }
      } else {
        // await g.commands.set(cmdarr);
      }
    } catch (e) {
      Logger.warn("Couldn't change guild slash commands!");
      Logger.warn(e);
    }
  }

  if (BotRuntime.botMode != "test") {
    await client.application.commands.set(cmdarr);
  }
}
