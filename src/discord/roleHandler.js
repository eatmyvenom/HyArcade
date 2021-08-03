const Role = require("../classes/Role");
const RoleUpdater = require("./RoleUpdater");
const logger = require("hyarcade-logger");

module.exports = async function roleHandler(client) {
    let pgGuild = await client.guilds.fetch("741719121456267319");
    let PG = new RoleUpdater(
        pgGuild,
        [
            new Role(7000, "839367531747344404"),
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

    let hsGuild = await client.guilds.fetch("846141095448150018");
    let HS = new RoleUpdater(
        hsGuild,
        [
            new Role(20000, "846141095719993373"),
            new Role(15000, "846141095719993372"),
            new Role(10000, "846141095719993371"),
            new Role(7500, "846141095719993370"),
            new Role(5000, "846141095719993369"),
            new Role(4000, "846141095719993368"),
            new Role(3000, "846141095719993367"),
            new Role(2000, "846141095719993366"),
            new Role(1000, "846141095719993365"),
            new Role(500, "846141095719993364"),
            new Role(420, "846141095708327975"),
            new Role(250, "846141095708327974"),
            new Role(100, "846141095708327973"),
            new Role(69, "846141095708327972"),
            new Role(50, "846141095708327971"),
            new Role(25, "846141095708327970"),
            new Role(1, "846141095708327969"),
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

    let hnsGuild = await client.guilds.fetch("839842177755775026");
    let HNS = new RoleUpdater(
        hnsGuild,
        [
            new Role(10000, "839874994225545256"),
            new Role(5000, "839851167651069962"),
            new Role(2500, "839843252194377728"),
            new Role(1000, "839850875463925822"),
            new Role(500, "839843337904062514"),
            new Role(250, "840080298011787264"),
            new Role(100, "839843397543657502"),
            new Role(0, "839843424575815680"),
        ],
        "hideAndSeekWins"
    );
    let HNSK = new RoleUpdater(
        hnsGuild,
        [
            new Role(40000, "847464019497320499"),
            new Role(30000, "847463969454948362"),
            new Role(20000, "847463926660464670"),
            new Role(10000, "847463872960266300"),
            new Role(5000, "847463831814012939"),
            new Role(2500, "847463780552146944"),
            new Role(1000, "847463739632386088"),
            new Role(500, "847463690239213568"),
            new Role(250, "847463651224322078"),
            new Role(100, "847463463253049435"),
        ],
        "hnsKills"
    );

    // await PG.updateAll();
    // await HS.updateAll();
    // await TO.updateAll();
    // await SIM.updateAll();
    // await FH.updateAll();
    // await HNS.updateAll();
    // await HNSK.updateAll();
    logger.out("Roles updated");
};
