const status = require("./status");
const utils = require("./utils");
const fs = require("fs/promises");
let { accounts, gamers, afkers } = require("./acclist");
const config = require("../config.json");
const hypixelAPI = require("./hypixelApi");
let force = utils.fileExists("force") || config.alwaysForce;

async function genStatus() {
    // old status

    let statusObj = {};
    let oldstatus = JSON.parse(await fs.readFile("status.json"));
    let accdata = require("../accounts.json");

    await Promise.all(
        accounts.map(async (account) => {
            if (accdata.find((acc) => acc.uuid == account.uuid).isLoggedIn) {
                if (gamers.includes(account)) {
                    statusObj[account.uuid] = JSON.parse(
                        await hypixelAPI.getStatusRAW(account.uuid)
                    ).session;
                } else if (!force && afkers.includes(account)) {
                    // get old status instead
                    let old = oldstatus[account.uuid];
                    // datafixer
                    old = old.session ? old.session : old;
                    if (old == undefined) {
                        statusObj[account.uuid] = JSON.parse(
                            await hypixelAPI.getStatusRAW(account.uuid)
                        ).session;
                    } else {
                        statusObj[account.uuid] = old;
                    }
                } else {
                    // force true or not afker
                    statusObj[account.uuid] = JSON.parse(
                        await hypixelAPI.getStatusRAW(account.uuid)
                    ).session;
                }
            }
        })
    );

    await Promise.all([
        // write object
        utils.writeJSON("status.json", statusObj),
        // store the cache misses
        utils.writeJSON("cachemiss.json", utils.cacheMiss),
    ]);
    await statusTxt();
}

async function statusTxt() {
    let gamerstr = "";
    let nongamers = "";

    let accs = require("./acclist").accounts;

    let crntstatus = require("../status.json");
    for (const account of accs) {
        if (
            (await gamers.find((acc) => acc.uuid == account.uuid)) != undefined
        ) {
            gamerstr += await status.genStatus(
                account.name,
                crntstatus[account.uuid]
            );
        } else {
            nongamers += await status.genStatus(
                account.name,
                crntstatus[account.uuid]
            );
        }
    }

    await fs.writeFile(
        "status.txt",
        `${gamerstr}\nNon gamers:\n\n${nongamers}`
    );
}

async function updateAllAccounts() {
    // sort this before hand because otherwise everything dies
    // like seriously holy fuck its so bad
    // oogle ended up with 21k wins due to this bug
    // do not remove this
    // people will notice
    // just take the extra time
    // ...
    // okay maybe its redundant now
    accounts.sort(utils.winsSorter);

    // Yes, this is abusive to the api, but also consider this
    // SPEEEEEEEEDDD
    await Promise.all(
        accounts.map(async (account) => {
            await account.updateData();
        })
    );
    await accounts.sort(utils.winsSorter);
    return accounts;
}

module.exports = {
    genStatus: genStatus,
    updateAllAccounts: updateAllAccounts,
};
