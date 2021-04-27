const { WebhookClient } = require("discord.js");
const BotUtils = require("./BotUtils");
const CommandParser = require("./interactions/CommandParser");

async function interactionHandler(interaction) {
    let responseObj = await CommandParser(interaction);
    try {
        await BotUtils.client.api
            .interactions(interaction.id, interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    data: {
                        content: responseObj.res,
                        embeds: [responseObj.embed],
                    },
                },
            });
    } catch (e) {
        let tmpHook = new WebhookClient(
            BotUtils.client.user.id,
            interaction.token
        );
        await tmpHook.send(responseObj.res, { embeds: [responseObj.embed] });
    }
    await BotUtils.logHook.send(
        `${interaction.member.user.username}#${
            interaction.member.user.discriminator
        } invoked interaction \`${
            interaction.data.name
        }\` with options \`${JSON.stringify(interaction.data.options)}\``
    );
}

module.exports = async (client) => {
    client.ws.on("INTERACTION_CREATE", interactionHandler);
};
