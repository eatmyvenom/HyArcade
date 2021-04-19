const utils = require("../utils");
const Role = require("../classes/Role");
const RoleUpdater = require('./RoleUpdater');

module.exports = async function roleHandler(client) {
    let pgGuild = await client.guilds.fetch('741719121456267319');
    let PG = new RoleUpdater(pgGuild, [
        new Role(6000, '812401869271859201'),
        new Role(5000, '803673705221849149'),
        new Role(4000, '786711230764941332'),
        new Role(3000, '775402674970427452'),
        new Role(2000, '755544666065076375'),
        new Role(1500, '747258820299980860'),
        new Role(1000, '742472526537424916'),
        new Role(750, '742469856112148581'),
        new Role(500, '742716734418714714'),
        new Role(250, '746627523407773797'),
        new Role(100, '742719474670764083'),
        new Role(50, '746847997874143312'),
        new Role(10, '746848002731147374'),
        new Role(0, '766422200663408662')
    ], "wins");

    await PG.updateAll();

}