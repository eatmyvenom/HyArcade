const { Client, Interaction, CommandInteraction, ButtonInteraction } = require("discord.js");
const utils = require("../utils");
const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const ButtonParser = require("./interactions/Buttons/ButtonParser");
const ForceOGuser = require("./interactions/Buttons/ForceOGuser");
const CommandParser = require("./interactions/CommandParser");
const fs = require('fs-extra');
const Webhooks = require("./Utils/Webhooks");
const CommandResponse = require("./Utils/CommandResponse");
const { LOG_SLASH_COMMAND_USAGE, LOG_MESSAGE_COMPONENT_USAGE } = require("./Utils/Embeds/DynamicEmbeds");

async function isBlacklisted(id) {
    let blacklist = await fs.readFile("data/blacklist");
    blacklist = blacklist.toString().split("\n");
    return blacklist.includes(id);
}

/**
 *
 * @param {CommandInteraction} interaction
 */
async function commandHandler(interaction) {
    if(await isBlacklisted(interaction.user.id)) { return };
    let responseObj;
    try {
        responseObj = await CommandParser(interaction);
    } catch (e) {
        logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}`)
        logger.err(e);
        await Webhooks.errHook.send({ content: `Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}` });
        await Webhooks.errHook.send({ content: e.toString() });
        return;
    }

    let res;
    if(responseObj instanceof CommandResponse) {
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
        logger.err(`Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}`)
        logger.err(e);
        logger.err(e.stack);
        await Webhooks.errHook.send({ content: `Error from /${interaction.commandName} ${JSON.stringify(interaction.options)}` });
        await Webhooks.errHook.send({ content: e.toString() });
        return;
    }

    let logString = `${interaction.member.user.tag} invoked command interaction \`${
        interaction.commandName
    }\` with options \`${JSON.stringify(interaction.options)}\``;
    logger.out(logString.replace(/`/g, "'"));
    await Webhooks.logHook.send(logString);
    await logCmd(interaction);
}

/**
 *
 * @param {Interaction} interaction
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
                interaction.options
            ),
        ],
    });
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
                interaction.guild?.name,
                interaction.channel?.id
            ),
        ],
    });
}

/**
 *
 * @param {Interaction} interaction
 */
async function buttonHandler(interaction) {
    if (await ForceOGuser(interaction)) {
        let updatedData = await ButtonParser(interaction);
        await interaction.update(updatedData.toDiscord());
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
    }
}

/**
 *
 * @param {Client} client
 */
async function registerAll(client) {
    let interactionObjects = require("./interactions/interactionObjects");
    logger.info("Registering global commands with discord");
    let cmdarr = [];
    if(BotUtils.botMode == "mini") {
        interactionObjects = require("./interactions/microInteractionObjects");
    }
    for (let c in interactionObjects) {
        cmdarr.push(interactionObjects[c]);
    }

    let guilds = client.guilds;
    guilds.cache.array();
    for (let g of guilds.cache.array()) {
        try {
            if(BotUtils.botMode != "test") {
                await g.commands.set([]);
            } else {
                await g.commands.set(cmdarr);
            }
        } catch (e) {
            logger.error("Couldn't change guild slash commands!");
            logger.error(e);
        }
    }

    if(BotUtils.botMode != "test") {
        await client.application.commands.set(cmdarr);
    }
}

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
    await registerAll(client);
    client.on("interactionCreate", interactionHandler);
};
