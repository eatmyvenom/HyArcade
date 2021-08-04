const Account = require("../src/request/types/Account");

/**
 * Test if "bloozing" works correctly
 */
async function main () {
    let a = new Account("bloozing", 0, "16ddab826eb74fff81d1e1566a3c6d19");
    await a.updateData();
    console.log(a);
}

main();