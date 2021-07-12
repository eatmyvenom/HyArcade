const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const roleHandler = require("../roleHandler");

module.exports = new Command("UpdateRoles", ["%trusted%"], async (args) => {
    await roleHandler(BotUtils.client);
    return { res: "Roles updated successfully" };
});
