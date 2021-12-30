const HyarcadeWorkerRequest = require("../src/request/HyarcadeWorkerRequest");

/**
 * 
 */
async function main () {
  const h = await HyarcadeWorkerRequest(["38be93494aa140fe80ba1e4eb23ef17a"].join(","));
  for(const a in h.data) {
    console.log(`${a} - ${h.data[a].player.displayname}`);
  }
}

main();