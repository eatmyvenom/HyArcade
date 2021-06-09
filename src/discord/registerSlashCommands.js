const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const CommandParser = require("./interactions/CommandParser");
const { compare } = require("./interactions/interactionObjects");

async function interactionHandler(interaction) {
    let responseObj = await CommandParser(interaction);

    if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({
            content: responseObj.res,
            embeds: [responseObj.embed],
        });
    } else {
        await interaction.webhook.send(responseObj.res, {
            embeds: [responseObj.embed],
        });
    }

    let logString = `${interaction.member.user.tag} invoked interaction \`${interaction.commandName}\` with options \`${JSON.stringify(interaction.options)}\``;

    logger.out(logString);
    await BotUtils.logHook.send(logString);

    await BotUtils.logCommand(interaction.commandName, JSON.stringify(interaction.options), interaction.member.user.id);
}

module.exports = async (client) => {
    client.on("interaction", interactionHandler);
};
