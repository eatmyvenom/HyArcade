// custom id spec
// [command type]:[specific data1]:[specific data2]
// Leaderboard example - lb:20:mw
// Stats example - s:92a5199614ac4bd181d1f3c951fb719f:pg

const BotUtils = require("../../BotUtils");
const Leaderboard = require("../../Commands/Leaderboard");
const InteractionUtils = require("../InteractionUtils");
const ButtonResponse = require("./ButtonResponse");

module.exports = async function ButtonParser(interaction) {
    let data = interaction.customID.split(":");
    let commandType = data[0];
    switch(commandType) {
        case "lb" : {
            return leaderboardHandler(interaction, data[1], data[2], data[3]);
        }

        case "s" : {
            return statsHandler(data[1], data[2]);
        }
    }
}

async function leaderboardHandler(interaction, leaderboard, time, index) {
    let res = Leaderboard.execute([leaderboard, time, 10, index], interaction.member.user.id, undefined, interaction);
    let e = res.embed;
    let buttons = await ButtonGenerator.getLBButtons(res.start, res.game, getArg(interaction, "type"));
    return new ButtonResponse("", [ e ], buttons);
}

async function statsHandler(accUUID, game) {
    let accData = await InteractionUtils.accFromUUID(accUUID);
    let statsRes = await BotUtils.getStats(accData, game);
    let embed = statsRes.embed;

    let buttons = await InteractionUtils.getStatsButtons(game, accData.uuid);
    return new ButtonResponse("", [ embed ], buttons);
}