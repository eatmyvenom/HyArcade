const utils = require("../utils");
const Role = require("../classes/Role");
const RoleUpdater = require("./RoleUpdater");
const { logger } = require("../utils");

module.exports = async function roleHandler(client) {
    let pgGuild = await client.guilds.fetch("741719121456267319");
    let PG = new RoleUpdater(
        pgGuild,
        [
            new Role(6000, "812401869271859201"),
            new Role(5000, "803673705221849149"),
            new Role(4000, "786711230764941332"),
            new Role(3000, "775402674970427452"),
            new Role(2000, "755544666065076375"),
            new Role(1500, "747258820299980860"),
            new Role(1000, "742472526537424916"),
            new Role(750, "742469856112148581"),
            new Role(500, "742716734418714714"),
            new Role(250, "746627523407773797"),
            new Role(100, "742719474670764083"),
            new Role(50, "746847997874143312"),
            new Role(10, "746848002731147374"),
            new Role(0, "766422200663408662"),
        ],
        "wins"
    );

    let hsGuild = await client.guilds.fetch("808077828842455090");
    let HS = new RoleUpdater(
        hsGuild,
        [
            new Role(20000, "808084296714682429"),
            new Role(15000, "808082861982482483"),
            new Role(10000, "808082803404439592"),
            new Role(7500, "808082131993493515"),
            new Role(5000, "808084994047868928"),
            new Role(4000, "808085583263301653"),
            new Role(3000, "808082280626782218"),
            new Role(2000, "808081952179617863"),
            new Role(1000, "808084025113575425"),
            new Role(500, "808081875167870996"),
            new Role(420, "826989171700138015"),
            new Role(250, "808081595784232980"),
            new Role(100, "808088119802593290"),
            new Role(69, "827336403746422826"),
            new Role(50, "808084702439014471"),
            new Role(25, "818251516728836136"),
            new Role(1, "809189689247662111"),
            new Role(0, "808083629964001350"),
        ],
        "hypixelSaysWins"
    );

    let toGuild = await client.guilds.fetch("809959535174352946");
    let TO = new RoleUpdater(
        toGuild,
        [
            new Role(1000, "815629891034546216"),
            new Role(500, "815629891395518485"),
            new Role(300, "815629894453166100"),
            new Role(100, "815629895303430184"),
            new Role(50, "815629895303430184"),
        ],
        "throwOutWins"
    );

    let simGuild = await client.guilds.fetch("826906189404176415");
    let SIM = new RoleUpdater(
        simGuild,
        [
            new Role(5000, "826929696443859014"),
            new Role(2500, "826929634352168960"),
            new Role(1000, "826929551308226580"),
            new Role(500, "826929551308226580"),
            new Role(250, "826929365648146483"),
            new Role(100, "826929192062681099"),
        ],
        "simTotal"
    );

    let fhGuild = await client.guilds.fetch("810614388612136960");
    let FH = new RoleUpdater(
        fhGuild,
        [
            new Role(12000, "812397910758916096"),
            new Role(11000, "836727692254380043"),
            new Role(10000, "836727974589628417"),
            new Role(9000, "836728057347178576"),
            new Role(8000, "836728141107822643"),
            new Role(7000, "836728270586249226"),
            new Role(6000, "836728469638479982"),
            new Role(5000, "836728557991886848"),
            new Role(4000, "836728693342470244"),
            new Role(3000, "836728820765163580"),
            new Role(2000, "836729009789206528"),
            new Role(1000, "836729101536591923"),
            new Role(750, "836729216321585223"),
            new Role(500, "836729390301053010"),
            new Role(250, "836729521575165982"),
            new Role(100, "836729854019371039"),
            new Role(50, "836729997171490877"),
            new Role(0, "836730103743905834"),
        ],
        "farmhuntWins"
    );

    logger.out("Updating roles for Party gamers \n");
    await PG.updateAll();
    // logger.out('\nUpdating roles for Hypixel Says \n')
    // await HS.updateAll();
    logger.out("\nUpdating roles for Throw out\n");
    await TO.updateAll();
    logger.out("\nUpdating roles for sim games \n");
    await SIM.updateAll();
    logger.out("\nUpdating roles in Farm Hunt\n");
    await FH.updateAll();
    logger.out("Roles updated");
};
