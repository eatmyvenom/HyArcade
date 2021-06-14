const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const CommandParser = require("./interactions/CommandParser");

async function commandHandler(interaction) {
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

async function buttonHandler(interaction) {
    let updatedData = await ButtonParser(interaction);
    await interaction.update(updatedData.toDiscord());
}

async function interactionHandler(interaction) {
    if(interaction.isCommand()) {
        await commandHandler(interaction);
    } else if(interaction.isButton()) {
        await buttonHandler(interaction);
    }
}

module.exports = async (client) => {
    client.on("interaction", interactionHandler);
};
