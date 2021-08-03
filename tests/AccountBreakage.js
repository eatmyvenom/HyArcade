const Account = require("hyarcade-requests/types/Account");

/**
 * Test if "fizzyferns" works correctly
 */
async function main () {
    let a = new Account("fizzyferns", 0, "7855118f2df742cdb91719b0c679c4d9");
    await a.updateData();
    console.log(a);
}

main();