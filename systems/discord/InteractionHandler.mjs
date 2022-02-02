import { createRequire } from "module";
import Logger from "hyarcade-logger";
import BotRuntime from "./BotRuntime.js";
import CommandResponse from "./Utils/CommandResponse.js";
import { ERROR_LOG, LOG_MESSAGE_COMPONENT_USAGE, LOG_SLASH_COMMAND_USAGE } from "./Utils/Embeds/DynamicEmbeds.js";
import { ERROR_BLACKLIST, ERROR_UNKNOWN } from "./Utils/Embeds/StaticEmbeds.js";
import Webhooks from "./Utils/Webhooks.js";
import ButtonParser from "./interactions/Buttons/ButtonParser.js";
import ForceOGuser from "./interactions/Buttons/ForceOGuser.js";
import CommandParser from "./interactions/CommandParser.mjs";
import MenuParser from "./interactions/SelectionMenus/MenuParser.js";
import AutoCompleter from "./interactions/Utils/AutoCompleter.js";
import registerAll from "./interactions/Utils/DeployCommands.mjs";

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
    embeds: [
      LOG_SLASH_COMMAND_USAGE(
        interaction.user?.id,
        interaction.user?.tag,
        interaction.commandName,
        interaction.guild?.name,
        interaction.channel?.id,
        interaction.options?.data,
      ),
    ],
  });
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function commandHandler(interaction) {
  if (await isBlacklisted(interaction?.user?.id)) {
    await interaction.reply({ embeds: [ERROR_BLACKLIST], ephemeral: true });
    return;
  }

  let responseObj;
  try {
    responseObj = await CommandParser(interaction);
  } catch (e) {
    try {
      Logger.err(e.stack);
      await Webhooks.errHook.send({
        embeds: [
          ERROR_LOG(
            e,
            `Error from /${interaction.commandName} ${JSON.stringify(
              interaction.options.data.map(a => `${a.name} : ${a.value}`),
            )}`,
          ),
        ],
      });
      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({ embeds: [ERROR_UNKNOWN], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
      }
      return;
    } catch (e) {
      Logger.err("Unable to give error response");
      await Webhooks.errHook.send({ content: `Unable to send error response in <#${interaction.channelId}>` });
    }
  }

  let res;
  if (responseObj instanceof CommandResponse) {
    res = responseObj;
  } else {
    res = new CommandResponse(responseObj);
  }

  try {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply(res.toDiscord());
    } else {
      await interaction.followUp(res.toDiscord());
    }
  } catch (e) {
    try {
      Logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options.data)}`);
      Logger.err(e.stack);
      Webhooks.errHook.send({
        embeds: [
          ERROR_LOG(
            e,
            `Interaction usage by ${interaction.user.tag}\n\`/${interaction.commandName} ${JSON.stringify(
              interaction.options.data,
            )}\``,
          ),
        ],
      });

      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({ embeds: [ERROR_UNKNOWN], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
      }
      return;
    } catch (e) {
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
    embeds: [
      LOG_MESSAGE_COMPONENT_USAGE(
        interaction.user?.id,
        interaction.user?.tag,
        interaction.customId,
        interaction.values,
        interaction.guild?.name,
        interaction.channel?.id,
      ),
    ],
  });
}

/**
 *
 * @param {ButtonInteraction} interaction
 */
async function buttonHandler(interaction) {
  if (await ForceOGuser(interaction)) {
    const updatedData = await ButtonParser(interaction);

    if (updatedData == undefined) {
      return;
    }

    try {
      if (interaction.deferred) {
        await interaction.editReply(updatedData.toDiscord());
      } else {
        await interaction.update(updatedData.toDiscord());
      }
    } catch (e) {
      Logger.err(e.stack);
      if (interaction.deferred) {
        try {
          await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
        } catch (e) {
          Logger.err(e.stack);
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
  if (await ForceOGuser(interaction)) {
    const updatedData = await MenuParser(interaction);

    if (updatedData == undefined) {
      return;
    }

    try {
      if (interaction.deferred) {
        await interaction.editReply(updatedData.toDiscord());
      } else {
        await interaction.update(updatedData.toDiscord());
      }
    } catch (e) {
      Logger.err(e.stack);
      if (interaction.deferred) {
        try {
          await interaction.followUp({ embeds: [ERROR_UNKNOWN], ephemeral: true });
        } catch (e) {
          Logger.err(e.stack);
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
  }
}

/**
 *
 * @param {Client} client
 */
export default async function (client) {
  registerAll(client)
    .then(() => {})
    .catch(Logger.err);

  client.on("interactionCreate", interactionHandler);
}
