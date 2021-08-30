import Logger from "hyarcade-logger";
import BotRuntime from "./BotRuntime.js";
import ButtonParser from "./interactions/Buttons/ButtonParser.js";
import ForceOGuser from "./interactions/Buttons/ForceOGuser.js";
import Webhooks from "./Utils/Webhooks.js";
import CommandResponse from "./Utils/CommandResponse.js";
import { LOG_SLASH_COMMAND_USAGE, LOG_MESSAGE_COMPONENT_USAGE, ERROR_LOG } from "./Utils/Embeds/DynamicEmbeds.js";
import MenuParser from "./interactions/SelectionMenus/MenuParser.js";
import microInteractionObjects from "./interactions/microInteractionObjects.js";
import fullInteractionObjects from "./interactions/interactionObjects.js";
import CommandParser from "./interactions/CommandParser.mjs";

import { createRequire } from "module";
import { ERROR_UNKNOWN } from "./Utils/Embeds/StaticEmbeds.js";
const require = createRequire(import.meta.url);
const { CommandInteraction, ButtonInteraction, SelectMenuInteraction, Interaction, Client } = require("discord.js");


/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted (id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function commandHandler (interaction) {


  if(await isBlacklisted(interaction?.user?.id)) {
    return;
  }

  let responseObj;
  try {
    responseObj = await CommandParser(interaction);
  } catch (e) {
    Logger.err(e.stack);
    await Webhooks.errHook.send({ embeds: [ERROR_LOG(e, `Error from /${interaction.commandName} ${JSON.stringify(interaction.options.data.map((a) => `${a.name} : ${a.value}`))}`)] });
    if(!interaction.deferred && !interaction.replied) {
      await interaction.reply({ embeds: [ ERROR_UNKNOWN ], ephemeral: true });
    } else {
      await interaction.followUp({ embeds: [ ERROR_UNKNOWN ], ephemeral: true });
    }
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

    if(!interaction.deferred && !interaction.replied) {
      await interaction.reply({ embeds: [ ERROR_UNKNOWN ], ephemeral: true });
    } else {
      await interaction.followUp({ embeds: [ ERROR_UNKNOWN ], ephemeral: true });
    }
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
    if(interaction.deferred) {
      await interaction.editReply(updatedData.toDiscord());
    } else {
      await interaction.update(updatedData.toDiscord());
    }
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
  if(BotRuntime.botMode == "mini") {
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

/**
 *
 * @param {Client} client
 */
export default async function (client) {
  await registerAll(client);
  client.on("interactionCreate", interactionHandler);
}
