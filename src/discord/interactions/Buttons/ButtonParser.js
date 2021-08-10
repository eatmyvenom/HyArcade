// custom id spec
// [command type]:[specific data1]:[specific data2]
// Leaderboard example - lb:20:mw
// Stats example - s:92a5199614ac4bd181d1f3c951fb719f:pg

const {
    ButtonInteraction
} = require("discord.js");
const BotUtils = require("../../BotUtils");
const Leaderboard = require("../../Commands/Leaderboard");
const InteractionUtils = require("../InteractionUtils");
const ButtonGenerator = require("./ButtonGenerator");
const ButtonResponse = require("./ButtonResponse");

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @returns {ButtonResponse}
 */
module.exports = async function ButtonParser (interaction) {
    const data = interaction.customId.split(":");
    const commandType = data[0];
    switch(commandType) {
    case "lb": {
        return await leaderboardHandler(interaction, data[1], data[2], data[3]);
    }

    case "s": {
        return await statsHandler(data[1], data[2]);
    }

    case "ez": {
        return await ezHandler();
    }
    }
};

/**
 * @param {ButtonInteraction} interaction
 * @param {string} leaderboard
 * @param {string} time
 * @param {number} index
 * @returns {ButtonResponse}
 */
async function leaderboardHandler (interaction, leaderboard, time, index) {
    const res = await Leaderboard.execute(
        [leaderboard, time, 10, index],
        interaction.member.user.id,
        undefined,
        interaction
    );
    const e = res.embed;
    const buttons = await ButtonGenerator.getLBButtons(res.start, res.game, time);
    return new ButtonResponse("", [e], buttons);
}

/**
 * @param {string} accUUID
 * @param {string} game
 * @returns {ButtonResponse}
 */
async function statsHandler (accUUID, game) {
    const accData = await InteractionUtils.accFromUUID(accUUID);
    const statsRes = await BotUtils.getStats(accData, game);
    const {embed} = statsRes;

    const buttons = await ButtonGenerator.getStatsButtons(game, accData.uuid);
    return new ButtonResponse("", [embed], buttons);
}

/**
 * @returns {ButtonResponse}
 */
async function ezHandler () {
    const msgs = await BotUtils.getFromDB("ezmsgs");
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    const buttons = await ButtonGenerator.getEZ();
    return new ButtonResponse(msg, undefined, buttons);
}
