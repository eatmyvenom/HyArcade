import Logger from "hyarcade-logger";
import { botMode, getBlacklist  } from "./BotRuntime";
import ButtonParser from "./interactions/Buttons/ButtonParser";
import ForceOGuser from "./interactions/Buttons/ForceOGuser";
import Webhooks from "./Utils/Webhooks";
import CommandResponse from "./Utils/CommandResponse";
import { LOG_SLASH_COMMAND_USAGE, LOG_MESSAGE_COMPONENT_USAGE, ERROR_LOG } from "./Utils/Embeds/DynamicEmbeds";
import MenuParser from "./interactions/SelectionMenus/MenuParser";
import { CommandInteraction, ButtonInteraction, SelectMenuInteraction, Interaction, Client } from "discord.js";
import microInteractionObjects from "./interactions/microInteractionObjects";
import fullInteractionObjects from "./interactions/interactionObjects";

let CommandParser = null;

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted (id) {
  const blacklist = await getBlacklist();
  return blacklist.includes(id);
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function commandHandler (interaction) {

  if(CommandParser === null) {
    CommandParser = await import("./interactions/CommandParser.mjs");
  }

  if(await isBlacklisted(interaction?.user?.id)) {
    return;
  }

  let responseObj;
  try {
    responseObj = await CommandParser(interaction);
  } catch (e) {
    Logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}`);
    Logger.err(e);
    await Webhooks.errHook.send({
      content: `Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}`
    });
    await Webhooks.errHook.send({
      content: e.toString()
    });
    return;
  }

  let res;
  if(responseObj instanceof CommandResponse) {
    res = responseObj;
  } else {
    res = new CommandResponse(responseObj);
  }

  try {
    if(!interaction.deferred && !interaction.replied) {
      await interaction.reply(res.toDiscord());
    } else {
      await interaction.followUp(res.toDiscord());
    }
  } catch (e) {
    Logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options.data)}`);
    Logger.err(e.stack);
    Webhooks.errHook.send({
      embeds: [ ERROR_LOG(e, `Interaction usage by ${interaction.user.tag}\n\`/${interaction.commandName} ${JSON.stringify(interaction.options.data)}\``) ]
    });
    return;
  }

  const logString = `${interaction?.member?.user?.tag} invoked command interaction \`${
    interaction.commandName
  }\` with options \`${JSON.stringify(interaction.options.data)}\``;
  Logger.out(logString.replace(/`/g, "'"));
  await Webhooks.logHook.send(logString);
  await logCmd(interaction);
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function logCmd (interaction) {
  await Webhooks.commandHook.send({
    embeds: [
      LOG_SLASH_COMMAND_USAGE(
        interaction.user?.id,
        interaction.user?.tag,
        interaction.commandName,
        interaction.guild?.name,
        interaction.channel?.id,
        interaction.options?.data
      ),
    ],
  });
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
async function logBtn (interaction) {
  await Webhooks.commandHook.send({
    embeds: [
      LOG_MESSAGE_COMPONENT_USAGE(
        interaction.user?.id,
        interaction.user?.tag,
        interaction.customId,
        interaction.values,
        interaction.guild?.name,
        interaction.channel?.id
      ),
    ],
  });
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
async function buttonHandler (interaction) {
  if(await ForceOGuser(interaction)) {
    const updatedData = await ButtonParser(interaction);
    await interaction.update(updatedData.toDiscord());
    await logBtn(interaction);
  }
}

/**
 *
 * @param {SelectMenuInteraction} interaction
 */
async function menuHandler (interaction) {
  if(await ForceOGuser(interaction)) {
    const updatedData = await MenuParser(interaction);
    await interaction.update(updatedData.toDiscord());
    await logBtn(interaction);
  }
}

/**
 *
 * @param {Interaction} interaction
 */
async function interactionHandler (interaction) {
  if(interaction.isCommand()) {
    await commandHandler(interaction);
  } else if(interaction.isButton()) {
    await buttonHandler(interaction);
  } else if(interaction.isSelectMenu()) {
    await menuHandler(interaction);
  }
}

/**
 *
 * @param {Client} client
 */
async function registerAll (client) {
  let interactionObjects = fullInteractionObjects;
  Logger.info("Registering global commands with discord");
  const cmdarr = [];
  if(botMode == "mini") {
    interactionObjects = microInteractionObjects;
  }
  for(const c in interactionObjects) {
    cmdarr.push(interactionObjects[c]);
  }

  const {
    guilds
  } = client;
  guilds.cache.array();
  for(const g of guilds.cache.array()) {
    try {
      if(botMode != "test") {
        await g.commands.set([]);
      } else {
        await g.commands.set(cmdarr);
      }
    } catch (e) {
      Logger.error("Couldn't change guild slash commands!");
      Logger.error(e);
    }
  }

  if(botMode != "test") {
    await client.application.commands.set(cmdarr);
  }
}

/**
 *
 * @param {Client} client
 */
export default async (client) => {
  await registerAll(client);
  client.on("interactionCreate", interactionHandler);
};
