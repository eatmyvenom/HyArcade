// custom id spec
// [command type]:[specific data1]:[specific data2]
// Leaderboard example - lb:20:mw
// Stats example - s:92a5199614ac4bd181d1f3c951fb719f:pg

const BotUtils = require("../../BotUtils");
const InteractionUtils = require("../InteractionUtils");
const ButtonResponse = require("./ButtonResponse");

module.exports = async function ButtonParser(interaction) {
    let data = interaction.customID.split(":");
    let commandType = data[0];
    switch(commandType) {
        case "lb" : {
            return leaderboardHandler(data[1], data[2]);
        }

        case "s" : {
            return statsHandler(data[1], data[2]);
        }
    }
}

async function leaderboardHandler(interaction, index, leaderboard) {

}

async function statsHandler(accUUID, game) {
    let accData = await InteractionUtils.accFromUUID(accUUID);
    let statsRes = await BotUtils.getStats(accData, game);
    let embed = statsRes.embed;

    let buttons = await InteractionUtils.getStatsButtons(game);
    return new ButtonResponse("", [ embed ], buttons);
}