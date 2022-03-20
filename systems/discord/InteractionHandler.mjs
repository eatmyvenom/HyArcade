import Logger from "hyarcade-logger";
import { createRequire } from "node:module";
import BotRuntime from "./BotRuntime.js";
import ForceOGuser from "./interactions/Buttons/ForceOGuser.js";
import CommandParser from "./interactions/CommandParser.mjs";
import ButtonParser from "./interactions/Components/Buttons/ButtonParser.js";
import MenuParser from "./interactions/Components/Menus/MenuParser.js";
import AutoCompleter from "./interactions/Utils/AutoCompleter.js";
import registerAll from "./interactions/Utils/DeployCommands.mjs";
import CommandResponse from "./Utils/CommandResponse.js";
import { ERROR_LOG, LOG_MESSAGE_COMPONENT_USAGE, LOG_SLASH_COMMAND_USAGE } from "./Utils/Embeds/DynamicEmbeds.js";
import { ERROR_BLACKLIST, ERROR_UNKNOWN } from "./Utils/Embeds/StaticEmbeds.js";
import Webhooks from "./Utils/Webhooks.js";

const require = createRequire(import.meta.url);
const { CommandInteraction, ButtonInteraction, SelectMenuInteraction, Interaction, Client } = require("discord.js");

/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function isBlacklisted(id) {
  const blacklist = await BotRuntime.getBlacklist();
  return blacklist.includes(id);
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function logCmd(interaction) {
  await Webhooks.commandHook.send({
    embeds: [LOG_SLASH_COMMAND_USAGE(interaction)],
  });
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function commandHandler(interaction) {
  if (await isBlacklisted(interaction?.user?.id)) {
    Logger.warn("Blacklisted user was ignored");
    await interaction.reply({ embeds: [ERROR_BLACKLIST], ephemeral: true });
    return;
  }

  let responseObj;
  try {
    Logger.log(`${interaction.user.tag} ran "${interaction.commandName}"`);
    responseObj = await CommandParser(interaction);
  } catch (error) {
    try {
      Logger.err(error.stack);
      await Webhooks.errHook.send({
        embeds: [ERROR_LOG(error, `Error from /${interaction.commandName} ${JSON.stringify(interaction.options.data.map(a => `${a.name} : ${a.value}`))}`)],
      });
      await (!interaction.deferred && !interaction.replied
        ? interaction.reply({ embeds: [ERROR_UNKNOWN], ephemeral: true })
        : interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true }));
      return;
    } catch {
      Logger.err("Unable to give error response");
      await Webhooks.errHook.send({ content: `Unable to send error response in <#${interaction.channelId}>` });
    }
  }

  let res;
  res = responseObj instanceof CommandResponse ? responseObj : new CommandResponse(responseObj);

  try {
    await (!interaction.deferred && !interaction.replied ? interaction.reply(res.toDiscord()) : interaction.followUp(res.toDiscord()));
  } catch (error) {
    try {
      Logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options.data)}`);
      Logger.err(error.stack);
      Webhooks.errHook.send({
        embeds: [ERROR_LOG(error, `Interaction usage by ${interaction.user.tag}\n\`/${interaction.commandName} ${JSON.stringify(interaction.options.data)}\``)],
      });

      await (!interaction.deferred && !interaction.replied
        ? interaction.reply({ embeds: [ERROR_UNKNOWN], ephemeral: true })
        : interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true }));
      return;
    } catch {
      Logger.err("Unable to give error response");
      await Webhooks.errHook.send({ content: `Unable to send error response in <#${interaction.channelId}>` });
    }
  }

  await logCmd(interaction);
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
async function logBtn(interaction) {
  await Webhooks.commandHook.send({
    embeds: [LOG_MESSAGE_COMPONENT_USAGE(interaction)],
  });
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
async function buttonHandler(interaction) {
  Logger.verbose(`${interaction.user.tag} clicked button "${interaction.customId}`);
  if (await ForceOGuser(interaction)) {
    const updatedData = await ButtonParser(interaction);

    if (updatedData == undefined) {
      return;
    }

    try {
      await (interaction.deferred ? interaction.editReply(updatedData.toDiscord()) : interaction.update(updatedData.toDiscord()));
    } catch (error) {
      Logger.err(error.stack);
      if (interaction.deferred) {
        try {
          await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
        } catch (error) {
          Logger.err(error.stack);
        }
      }
    }
    await logBtn(interaction);
  }
}

/**
 *
 * @param {SelectMenuInteraction} interaction
 */
async function menuHandler(interaction) {
  Logger.verbose(`${interaction.user.tag} clicked menu "${interaction.customId}`);
  if (await ForceOGuser(interaction)) {
    const updatedData = await MenuParser(interaction);

    if (updatedData == undefined) {
      return;
    }

    try {
      await (interaction.deferred ? interaction.editReply(updatedData.toDiscord()) : interaction.update(updatedData.toDiscord()));
    } catch (error) {
      Logger.err(error.stack);
      if (interaction.deferred) {
        try {
          await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
        } catch (error) {
          Logger.err(error.stack);
        }
      }
    }
    await logBtn(interaction);
  }
}

/**
 *
 * @param {Interaction} interaction
 */
async function interactionHandler(interaction) {
  if (interaction.isCommand()) {
    await commandHandler(interaction);
  } else if (interaction.isButton()) {
    await buttonHandler(interaction);
  } else if (interaction.isSelectMenu()) {
    await menuHandler(interaction);
  } else if (interaction.isAutocomplete()) {
    await AutoCompleter(interaction);
  } else {
    Logger.warn("Unknown interaction type was attempted");
  }
}

/**
 *
 * @param {Client} client
 */
export default async function (client) {
  registerAll(client)
    .then(() => {})
    .catch(error => Logger.err(error.stack));

  client.on("interactionCreate", interactionHandler);
  Logger.out("'interactionCreate' bound");
}
