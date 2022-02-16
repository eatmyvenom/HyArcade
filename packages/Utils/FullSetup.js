const { existsSync, writeFile, readdir, mkdir } = require("fs-extra");
const { default: fetch } = require("node-fetch");

/**
 * @param path
 * @param url
 */
async function supplyFileFromURL(path, url) {
  if (!existsSync(path)) {
    const req = await fetch(url);
    await writeFile(path, await req.buffer());
  }
}

/**
 * @param path
 * @param str
 */
async function supplyFileFromString(path, str) {
  if (!existsSync(path)) {
    await writeFile(path, str);
  }
}

/**
 * @param path
 */
async function addDir(path) {
  try {
    await readdir(path);
  } catch {
    await mkdir(path);
  }
}

/**
 *
 */
async function FullSetup() {
  await addDir("data");
  await addDir("config");
  await supplyFileFromString("data/trustedUsers", "");
  await supplyFileFromURL("data/achievements.json", "https://api.hypixel.net/resources/achievements");
  await supplyFileFromString("data/ez", "EASY");
}

module.exports = FullSetup();
