const {
    SelectMenuInteraction
} = require("discord.js");
const BotUtils = require("../../BotUtils");
const ButtonResponse = require("../Buttons/ButtonResponse");
const InteractionUtils = require("../InteractionUtils");
const MenuGenerator = require("./MenuGenerator");

/**
 * 
 * @param {SelectMenuInteraction} interaction 
 * @returns {ButtonResponse}
 */
module.exports = async function MenuParser (interaction) {
    let data = interaction.customId.split(":");
    let commandType = data[0];
    switch(commandType) {
    case "s": {
        return await statsHandler(data[1], interaction.values[0]);
    }
    }
};

/**
 * @param {string} accUUID
 * @param {string} game
 * @returns {ButtonResponse}
 */
async function statsHandler (accUUID, game) {
    let accData = await InteractionUtils.accFromUUID(accUUID);
    let statsRes = await BotUtils.getStats(accData, game);
    let {embed} = statsRes;

    let mnu = await MenuGenerator.statsMenu(accUUID);
    return new ButtonResponse("", [embed], mnu);
}
