const { writeJson } = require("fs-extra");
const Logger = require("@hyarcade/logger");
const { HypixelApi } = require("@hyarcade/requests");
const Achievements = require("../packages/Structures/Achievements");

/**
 *
 */
async function main() {
  const accData = await HypixelApi.player("92a5199614ac4bd181d1f3c951fb719f");
  const achievements = new Achievements(accData.player);

  writeJson("data/achieved.json", achievements, { spaces: 4 });
}

main()
  .then(() => {})
  .catch(error => Logger.error(error.stack));
