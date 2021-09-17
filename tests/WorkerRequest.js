const HyarcadeWorkerRequest = require("../src/request/HyarcadeWorkerRequest");

/**
 * 
 */
async function main () {
  const h = await HyarcadeWorkerRequest(["38be93494aa140fe80ba1e4eb23ef17a", "3bd62e7edecd4baaa402ac84712e32cb", "527f18702ca942258a8f928c0077ab80", "48be221987b04028adedcc018573d748", "92a5199614ac4bd181d1f3c951fb719f"].join(","));
  for(const a in h.data) {
    console.log(`${a} - ${h.data[a].player.displayname}`);
  }
}

main();