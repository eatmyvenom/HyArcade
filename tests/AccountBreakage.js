const Account = require("../src/request/types/Account");

/**
 * Test if "bloozing" works correctly
 */
async function main () {
    let a = new Account("bigc1109", 0, "f0133668f8da4ab7ad3e62ca1b5574da");
    await a.updateData();
    console.log(a.arcadeAchievments.miniWalls);
}

main();