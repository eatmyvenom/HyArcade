const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const Embed = require("./Embeds");
const ButtonParser = require("./interactions/Buttons/ButtonParser");
const ForceOGuser = require("./interactions/Buttons/ForceOGuser");
const CommandParser = require("./interactions/CommandParser");
const interactionObjects = require("./interactions/interactionObjects")

async function commandHandler(interaction) {
    let responseObj;
    try{
        responseObj = await CommandParser(interaction);
    } catch(e) {
        logger.err(e);
        await BotUtils.errHook.send({ content : e.toString() });
        return;
    }

    let c = responseObj.b ? [ responseObj.b ] : undefined;
    let content = responseObj.res != "" ? responseObj.res : undefined

    if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({
            content : content,
            embeds: [responseObj.embed],
            components : c
        });
    } else {
        await interaction.webhook.send({
            content: content,
            embeds: [responseObj.embed],
            components : c
        });
    }

    let logString = `${interaction.member.user.tag} invoked command interaction \`${interaction.commandName}\` with options \`${JSON.stringify(interaction.options)}\``;
    logger.out(logString.replace(/`/g, "'"));
    await BotUtils.logHook.send(logString);
    await logCmd(interaction);
}

async function logCmd(interaction) {
    await BotUtils.msgCopyHook.send({ embeds : [Embed.slashUsed(interaction.user.id, interaction.user.tag, interaction.commandName, interaction.guild.name, interaction.channelID, interaction.options)]});
}

async function buttonHandler(interaction) {
    if(await ForceOGuser(interaction)) {
        let updatedData = await ButtonParser(interaction);
        await interaction.update(updatedData.toDiscord());
    }
}

async function interactionHandler(interaction) {
    if(interaction.isCommand()) {
        await commandHandler(interaction);
    } else if(interaction.isButton()) {
        await buttonHandler(interaction);
    }
}

async function registerAll(client) {
    let cmdarr = [];
    for(let c in interactionObjects) {
        cmdarr.push(interactionObjects[c]);
    }
    await client.application.commands.set(cmdarr);
}

module.exports = async (client) => {
    await registerAll(client)
    client.on("interaction", interactionHandler);
};
