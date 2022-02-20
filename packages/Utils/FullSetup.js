const { default: axios } = require("axios");
const { existsSync, writeFile, readdir, mkdir } = require("fs-extra");

/**
 * @param path
 * @param url
 */
async function supplyFileFromURL(path, url) {
  if (!existsSync(path)) {
    const req = await axios.get(url, { responseType: "text" });
    await writeFile(path, req.data);
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
