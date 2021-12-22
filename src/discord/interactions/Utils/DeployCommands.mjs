import Logger from "hyarcade-logger";
import BotRuntime from "../../BotRuntime.js";
import microInteractionObjects from "../microInteractionObjects.js";
import fullInteractionObjects from "../interactionObjects.js";
import MiniWallsInteractionObjects from "../MiniWallsInteractionObjects.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
export default async function (client) {
  let interactionObjects = fullInteractionObjects;
  Logger.info("Registering global commands with discord");
  if(BotRuntime.botMode == "mini") {
    interactionObjects = microInteractionObjects;
  } else if(BotRuntime.botMode == "mw") {
    interactionObjects = MiniWallsInteractionObjects;
  }

  const cmdarr = Object.values(interactionObjects);

  const { guilds } = client;
  guilds.cache.values();

  for(const g of guilds.cache.values()) {
    try {
      if(BotRuntime.botMode != "test") {
        await g.commands.set([]);
      } else {
        await g.commands.set(cmdarr);
      }
    } catch (e) {
      Logger.error("Couldn't change guild slash commands!");
      Logger.error(e);
    }
  }

  if(BotRuntime.botMode != "test") {
    await client.application.commands.set(cmdarr);
  }
}