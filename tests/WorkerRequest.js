const HyarcadeWorkerRequest = require("../src/request/HyarcadeWorkerRequest");

/**
 * 
 */
async function main () {
  const h = await HyarcadeWorkerRequest(["527f18702ca942258a8f928c0077ab80", "48be221987b04028adedcc018573d748", "92a5199614ac4bd181d1f3c951fb719f"].join(","));
  console.log(h);
}

main();