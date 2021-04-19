const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const roleHandler = require("../roleHandler");

module.exports = new Command('UpdateRoles', ['156952208045375488'], async (args)=> {
    await roleHandler(BotUtils.client);
    return { res : "Roles updated successfully" };
});