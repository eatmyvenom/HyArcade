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

    let hsGuild = await client.guilds.fetch('808077828842455090');
    let HS = new RoleUpdater(hsGuild, [
        new Role(20000, '808084296714682429'),
        new Role(15000, '808082861982482483'),
        new Role(10000, '808082803404439592'),
        new Role(7500, '808082131993493515'),
        new Role(5000, '808084994047868928'),
        new Role(4000, '808085583263301653'),
        new Role(3000, '808082280626782218'),
        new Role(2000, '808081952179617863'),
        new Role(1000, '808084025113575425'),
        new Role(500, '808081875167870996'),
        new Role(420, '826989171700138015'),
        new Role(250, '808081595784232980'),
        new Role(100, '808088119802593290'),
        new Role(69, '827336403746422826'),
        new Role(50, '808084702439014471'),
        new Role(25, '818251516728836136'),
        new Role(1, '809189689247662111'),
        new Role(0, '808083629964001350'),
    ], "hypixelSaysWins");

    await PG.updateAll();
    await HS.updateAll();

}