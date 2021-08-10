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
    let data = interaction.customId.split(":");
    let commandType = data[0];
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
    let res = await Leaderboard.execute(
        [leaderboard, time, 10, index],
        interaction.member.user.id,
        undefined,
        interaction
    );
    let e = res.embed;
    let buttons = await ButtonGenerator.getLBButtons(res.start, res.game, time);
    return new ButtonResponse("", [e], buttons);
}

/**
 * @param {string} accUUID
 * @param {string} game
 * @returns {ButtonResponse}
 */
async function statsHandler (accUUID, game) {
    let accData = await InteractionUtils.accFromUUID(accUUID);
    let statsRes = await BotUtils.getStats(accData, game);
    let embed = statsRes.embed;

    let buttons = await ButtonGenerator.getStatsButtons(game, accData.uuid);
    return new ButtonResponse("", [embed], buttons);
}

/**
 * @returns {ButtonResponse}
 */
async function ezHandler () {
    let msgs = await BotUtils.getFromDB("ezmsgs");
    let msg = msgs[Math.floor(Math.random() * msgs.length)];
    let buttons = await ButtonGenerator.getEZ();
    return new ButtonResponse(msg, undefined, buttons);
}
