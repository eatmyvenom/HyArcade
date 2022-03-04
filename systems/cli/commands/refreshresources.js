const { writeFile } = require("fs-extra");
const { HypixelApi } = require("hyarcade-requests");

/**
 *
 */
async function main() {
  const achievements = await HypixelApi.resources.achievements();
  await writeFile("data/achievements.json", JSON.stringify(achievements));
}

module.exports = main;
